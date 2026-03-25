package cz.hostingcentrum.Repository;

import cz.hostingcentrum.Model.EmailAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailAccountRepo extends JpaRepository<EmailAccount, Long> {
    List<EmailAccount> findByEmailDomainId(Long domainId);
}
