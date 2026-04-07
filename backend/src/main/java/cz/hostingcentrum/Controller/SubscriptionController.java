package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.SubscriptionDto;
import cz.hostingcentrum.Enum.SubscriptionStatus;
import cz.hostingcentrum.Interface.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @GetMapping("/api/v1/orders/me")
    public ResponseEntity<List<SubscriptionDto>> getAllSubscriptions() {
        return new ResponseEntity<>(subscriptionService.getAllSubscriptionsForCurrentUser(), HttpStatus.OK);
    }

    @GetMapping("/api/v1/orders/{id}")
    public ResponseEntity<SubscriptionDto> getSubscription(@PathVariable Long id) {
        SubscriptionDto subscription = subscriptionService.getSubscriptionById(id);
        if (subscription == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(subscription, HttpStatus.OK);
    }

    @PostMapping("/api/v1/orders")
    public ResponseEntity<SubscriptionDto> createSubscription(@RequestParam Long plan) {
        SubscriptionDto created = subscriptionService.createSubscription(plan);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/api/v1/orders/{id}/status")
    public ResponseEntity<SubscriptionDto> updateStatus(@PathVariable Long id, @RequestParam SubscriptionStatus status) {
        SubscriptionDto updated = subscriptionService.updateSubscriptionStatus(id, status);
        if (updated == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
}
