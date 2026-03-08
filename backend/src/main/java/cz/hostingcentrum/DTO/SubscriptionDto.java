package cz.hostingcentrum.DTO;

import cz.hostingcentrum.Enum.SubscriptionStatus;
import cz.hostingcentrum.Model.Subscription;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class SubscriptionDto {
    private Long id;
    private Long userId;
    private Long planId;
    private String orderNumber;
    private LocalDateTime startedAt;
    private LocalDateTime expiresAt;
    private LocalDateTime cancelledAt;
    private BigDecimal pricePaid;
    private SubscriptionStatus status;

    public static SubscriptionDto fromEntity(Subscription subscription) {
        SubscriptionDto dto = new SubscriptionDto();
        dto.setId(subscription.getId());
        dto.setUserId(subscription.getUser().getId());
        dto.setPlanId(subscription.getPlan().getId());
        dto.setOrderNumber(subscription.getOrderNumber());
        dto.setStartedAt(subscription.getStartedAt());
        dto.setExpiresAt(subscription.getExpiresAt());
        dto.setCancelledAt(subscription.getCancelledAt());
        return dto;
    }
}
