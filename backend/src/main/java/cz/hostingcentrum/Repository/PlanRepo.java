package cz.hostingcentrum.Repository;

import cz.hostingcentrum.Model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanRepo extends JpaRepository<Plan, Long> {

    List<Plan> findByIsActiveTrueOrderByDisplayOrderAsc();

    Optional<Plan> findByCode(String code);
}
