package cz.hostingcentrum.Interface;

import cz.hostingcentrum.DTO.CreateOrderDTO;
import cz.hostingcentrum.DTO.OrderDTO;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<OrderDTO> getOrdersByUserEmail(String email);
    OrderDTO createOrder(String userEmail, CreateOrderDTO createOrderDTO);
    OrderDTO simulatePayment(Long orderId);
    Optional<OrderDTO> getOrderById(Long id);
}
