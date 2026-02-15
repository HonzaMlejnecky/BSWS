package cz.hostingcentrum.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private String status;
    private String billingCycle;
    private String planCode;
    private String planName;
    private BigDecimal pricePaid;
    private LocalDateTime startedAt;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
