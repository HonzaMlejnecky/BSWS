package cz.hostingcentrum.Interface;

import cz.hostingcentrum.DTO.SubscriptionDto;
import cz.hostingcentrum.Enum.SubscriptionStatus;

import java.util.List;

public interface SubscriptionService {
    List<SubscriptionDto> getAllSubscriptions();
    SubscriptionDto getSubscriptionById(Long id);
    SubscriptionDto createSubscription(Long plan);
    SubscriptionDto updateSubscriptionStatus(Long id, SubscriptionStatus status);
    void deleteSubscription(Long id);
}
