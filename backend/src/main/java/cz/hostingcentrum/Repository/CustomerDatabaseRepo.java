package cz.hostingcentrum.Repository;

import cz.hostingcentrum.Model.CustomerDatabase;
import cz.hostingcentrum.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerDatabaseRepo extends JpaRepository<CustomerDatabase, Long> {
    List<CustomerDatabase> findByUserId(Long userId);
    long countByUserId(Long userId);
}