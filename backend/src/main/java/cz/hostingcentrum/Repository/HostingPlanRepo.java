package cz.hostingcentrum.Repository;

import cz.hostingcentrum.Model.HostingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HostingPlanRepo extends JpaRepository<HostingPlan, Long> {

    List<HostingPlan> findByIsActiveTrueOrderByDisplayOrderAsc();

    Optional<HostingPlan> findByCode(String code);
}
