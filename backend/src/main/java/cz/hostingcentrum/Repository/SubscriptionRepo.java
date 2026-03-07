package cz.hostingcentrum.Repository;

import cz.hostingcentrum.Model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepo extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserId(Long userId);
    Subscription findByOrderNumber(String orderNumber);
}
