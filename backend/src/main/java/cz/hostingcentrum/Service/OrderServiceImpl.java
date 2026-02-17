package cz.hostingcentrum.Service;

import cz.hostingcentrum.DTO.CreateOrderDTO;
import cz.hostingcentrum.DTO.OrderDTO;
import cz.hostingcentrum.Enum.BillingCycle;
import cz.hostingcentrum.Enum.OrderStatus;
import cz.hostingcentrum.Interface.OrderService;
import cz.hostingcentrum.Model.HostingPlan;
import cz.hostingcentrum.Model.Order;
import cz.hostingcentrum.Model.User;
import cz.hostingcentrum.Repository.HostingPlanRepo;
import cz.hostingcentrum.Repository.OrderRepo;
import cz.hostingcentrum.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);
    private final OrderRepo orderRepo;
    private final HostingPlanRepo hostingPlanRepo;
    private final UserRepo userRepo;

    @Override
    public List<OrderDTO> getOrdersByUserEmail(String email) {
        log.debug("Fetching orders for user: {}", email);
        Optional<User> user = userRepo.findByEmail(email);
        if (user.isEmpty()) {
            log.warn("User not found: {}", email);
            return List.of();
        }
        return orderRepo.findByUserIdOrderByCreatedAtDesc(user.get().getId())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    @Override
    public OrderDTO createOrder(String userEmail, CreateOrderDTO createOrderDTO) {
        log.info("Creating order for user: {}, plan: {}", userEmail, createOrderDTO.getPlanCode());

        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        HostingPlan plan = hostingPlanRepo.findByCode(createOrderDTO.getPlanCode())
                .orElseThrow(() -> new RuntimeException("Plan not found: " + createOrderDTO.getPlanCode()));

        Order order = new Order();
        order.setUser(user);
        order.setPlan(plan);
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(OrderStatus.PENDING);
        order.setBillingCycle(BillingCycle.valueOf(createOrderDTO.getBillingCycle().toUpperCase()));

        if (order.getBillingCycle() == BillingCycle.YEARLY) {
            order.setPricePaid(plan.getPriceYearly());
        } else {
            order.setPricePaid(plan.getPriceMonthly());
        }

        Order saved = orderRepo.save(order);
        log.info("Order created: {}", saved.getOrderNumber());

        return toDTO(saved);
    }

    @Transactional
    @Override
    public OrderDTO simulatePayment(Long orderId) {
        log.info("Simulating payment for order: {}", orderId);

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Order is not in PENDING status");
        }

        order.setStatus(OrderStatus.ACTIVE);
        order.setStartedAt(LocalDateTime.now());

        if (order.getBillingCycle() == BillingCycle.YEARLY) {
            order.setExpiresAt(LocalDateTime.now().plusYears(1));
        } else {
            order.setExpiresAt(LocalDateTime.now().plusMonths(1));
        }

        Order saved = orderRepo.save(order);
        log.info("Payment simulated, order activated: {}", saved.getOrderNumber());

        return toDTO(saved);
    }

    @Override
    public Optional<OrderDTO> getOrderById(Long id) {
        return orderRepo.findById(id).map(this::toDTO);
    }

    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "ORD-" + timestamp;
    }

    private OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setStatus(order.getStatus().name());
        dto.setBillingCycle(order.getBillingCycle().name());
        dto.setPlanCode(order.getPlan().getCode());
        dto.setPlanName(order.getPlan().getName());
        dto.setPricePaid(order.getPricePaid());
        dto.setStartedAt(order.getStartedAt());
        dto.setExpiresAt(order.getExpiresAt());
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }
}
