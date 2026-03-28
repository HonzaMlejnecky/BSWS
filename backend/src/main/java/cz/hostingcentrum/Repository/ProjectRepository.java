package cz.hostingcentrum.Repository;

import cz.hostingcentrum.Model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByUserId(Long userId);
    long countByUserId(Long userId);
    boolean existsByDomainIgnoreCase(String domain);
    Optional<Project> findByIdAndUserId(Long id, Long userId);
}
