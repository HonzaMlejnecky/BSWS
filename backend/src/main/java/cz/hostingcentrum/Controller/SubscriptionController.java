package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.SubscriptionDto;
import cz.hostingcentrum.Enum.SubscriptionStatus;
import cz.hostingcentrum.Interface.SubscriptionService;
import cz.hostingcentrum.generated.api.OrdersApi;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SubscriptionController implements OrdersApi {
    private final SubscriptionService subscriptionService;

    @Override
    public ResponseEntity<List<SubscriptionDto>> getAllSubscriptions() {
        return new ResponseEntity<>(subscriptionService.getAllSubscriptionsForCurrentUser(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<SubscriptionDto> getSubscription(Long id) {
        SubscriptionDto subscription = subscriptionService.getSubscriptionById(id);
        if (subscription == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(subscription, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<SubscriptionDto> createSubscription(Long plan) {
        SubscriptionDto created = subscriptionService.createSubscription(plan);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<SubscriptionDto> updateStatus(Long id, SubscriptionStatus status) {
        SubscriptionDto updated = subscriptionService.updateSubscriptionStatus(id, status);
        if (updated == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
}
