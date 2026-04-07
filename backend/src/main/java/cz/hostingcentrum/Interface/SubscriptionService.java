package cz.hostingcentrum.Interface;

import cz.hostingcentrum.DTO.SubscriptionDto;
import cz.hostingcentrum.Enum.SubscriptionStatus;

import java.util.List;

public interface SubscriptionService {
    List<SubscriptionDto> getAllSubscriptionsForCurrentUser();
    SubscriptionDto getSubscriptionById(Long id);
    SubscriptionDto createSubscription(Long plan);
    SubscriptionDto updateSubscriptionStatus(Long id, SubscriptionStatus status);
}
