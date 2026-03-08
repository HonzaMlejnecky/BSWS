package cz.hostingcentrum.Repository;

import cz.hostingcentrum.Model.SftpAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SftpAccountRepo extends JpaRepository<SftpAccount, Long> {
    Long countByUserId(Long userId);
    List<SftpAccount> findByUserId(Long userId);
}
