package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.CreateOrderDTO;
import cz.hostingcentrum.DTO.OrderDTO;
import cz.hostingcentrum.Service.OrderServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Hosting orders management")
public class OrderController {

    private static final Logger log = LoggerFactory.getLogger(OrderController.class);
    private final OrderServiceImpl orderServiceImpl;

    @GetMapping
    @Operation(
            summary = "My orders",
            description = "Returns list of orders for the current user."
    )
    public ResponseEntity<List<OrderDTO>> getMyOrders(Authentication authentication) {
        String email = authentication.getName();
        log.debug("Fetching orders for user: {}", email);
        List<OrderDTO> orders = orderServiceImpl.getOrdersByUserEmail(email);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get order by ID",
            description = "Returns details of a specific order."
    )
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        log.debug("Fetching order: {}", id);
        return orderServiceImpl.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(
            summary = "Create order",
            description = "Creates a new order for the current user."
    )
    public ResponseEntity<OrderDTO> createOrder(
            Authentication authentication,
            @RequestBody CreateOrderDTO createOrderDTO
    ) {
        String email = authentication.getName();
        log.info("Creating order for user: {}, plan: {}", email, createOrderDTO.getPlanCode());
        try {
            OrderDTO order = orderServiceImpl.createOrder(email, createOrderDTO);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            log.error("Error creating order: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/pay")
    @Operation(
            summary = "Simulate payment",
            description = "Simulates payment for an order and activates hosting."
    )
    public ResponseEntity<OrderDTO> simulatePayment(@PathVariable Long id) {
        log.info("Simulating payment for order: {}", id);
        try {
            OrderDTO order = orderServiceImpl.simulatePayment(id);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            log.error("Error processing payment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
