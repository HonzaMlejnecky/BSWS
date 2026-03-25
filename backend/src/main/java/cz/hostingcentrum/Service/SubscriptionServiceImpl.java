package cz.hostingcentrum.Service;

import cz.hostingcentrum.DTO.SubscriptionDto;
import cz.hostingcentrum.Enum.SubscriptionStatus;
import cz.hostingcentrum.Interface.SubscriptionService;
import cz.hostingcentrum.Model.Plan;
import cz.hostingcentrum.Model.Subscription;
import cz.hostingcentrum.Model.User;
import cz.hostingcentrum.Repository.PlanRepo;
import cz.hostingcentrum.Repository.SubscriptionRepo;
import cz.hostingcentrum.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepo subscriptionRepo;
    private final PlanRepo planRepo;
    private final UserRepo userRepo;

    // ========================================================================
    // Get all subscriptions
    // ========================================================================
    public List<SubscriptionDto> getAllSubscriptionsByUserId(Long userId) {
        return subscriptionRepo.findByUserId(userId)
                .stream()
                .map(SubscriptionDto::fromEntity)
                .collect(Collectors.toList());
    }

    // ========================================================================
    // Get subscription by ID
    // ========================================================================
    public SubscriptionDto getSubscriptionById(Long id) {
        Optional<Subscription> optional = subscriptionRepo.findById(id);
        return optional.map(SubscriptionDto::fromEntity).orElse(null);
    }

    // ========================================================================
    // Create a new subscription
    // ========================================================================
    public SubscriptionDto createSubscription(Long plan) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }

        Optional<User> userOpt = userRepo.findByEmail(authentication.getName());
        Optional<Plan> planOpt = planRepo.findById(plan);

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        if (planOpt.isEmpty()){
            throw new IllegalArgumentException("Plan not found");
        }

        Subscription subscription = new Subscription();
        subscription.setUser(userOpt.get());
        subscription.setPlan(planOpt.get());
        subscription.setPricePaid(planOpt.get().getPriceMonthly());
        subscription.setCreatedAt(LocalDateTime.now());
        subscription.setUpdatedAt(LocalDateTime.now());
        subscription.setStatus(SubscriptionStatus.active);
        subscription.setOrderNumber(
                "ORD-" +
                        LocalDate.now().getYear() + "-" +
                        LocalDate.now().getMonthValue() + "-" +
                        System.currentTimeMillis()
        );
        subscription.setStartedAt(LocalDateTime.now());
        subscription.setExpiresAt(LocalDateTime.now().plusMonths(1L));

        Subscription saved = subscriptionRepo.save(subscription);
        return SubscriptionDto.fromEntity(saved);
    }

    // ========================================================================
    // Update subscription status
    // ========================================================================
    public SubscriptionDto updateSubscriptionStatus(Long id, SubscriptionStatus status) {
        Optional<Subscription> optional = subscriptionRepo.findById(id);
        if (optional.isEmpty()) {
            return null;
        }
        Subscription subscription = optional.get();
        subscription.setStatus(status);
        Subscription updated = subscriptionRepo.save(subscription);
        return SubscriptionDto.fromEntity(updated);
    }
}
