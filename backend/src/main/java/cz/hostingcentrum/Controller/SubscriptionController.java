package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.SubscriptionDto;
import cz.hostingcentrum.Enum.SubscriptionStatus;
import cz.hostingcentrum.Interface.SubscriptionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Hosting orders management")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    // ========================================================================
    // GET all subscriptions
    // ========================================================================
    @GetMapping
    public ResponseEntity<List<SubscriptionDto>> getAllSubscriptions() {
        List<SubscriptionDto> subscriptions = subscriptionService.getAllSubscriptions();
        return new ResponseEntity<>(subscriptions, HttpStatus.OK);
    }

    // ========================================================================
    // GET subscription by ID
    // ========================================================================
    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionDto> getSubscription(@PathVariable Long id) {
        SubscriptionDto subscription = subscriptionService.getSubscriptionById(id);
        if (subscription == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(subscription, HttpStatus.OK);
    }

    // ========================================================================
    // POST create new subscription
    // ========================================================================
    @PostMapping
    public ResponseEntity<SubscriptionDto> createSubscription(@RequestParam Long plan) {
        SubscriptionDto created = subscriptionService.createSubscription(plan);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // ========================================================================
    // PUT update subscription status
    // ========================================================================
    @PutMapping("/{id}/status")
    public ResponseEntity<SubscriptionDto> updateStatus(@PathVariable Long id,
                                                        @RequestParam SubscriptionStatus status) {
        SubscriptionDto updated = subscriptionService.updateSubscriptionStatus(id, status);
        if (updated == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    // ========================================================================
    // DELETE subscription
    // ========================================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

