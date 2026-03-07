package cz.hostingcentrum.Service;

import cz.hostingcentrum.DTO.SftpAccountDto;
import cz.hostingcentrum.Enum.SubscriptionStatus;
import cz.hostingcentrum.Interface.SftpAccountService;
import cz.hostingcentrum.Model.SftpAccount;
import cz.hostingcentrum.Model.Subscription;
import cz.hostingcentrum.Model.User;
import cz.hostingcentrum.Repository.SftpAccountRepo;
import cz.hostingcentrum.Repository.SubscriptionRepo;
import cz.hostingcentrum.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SftpAccountServiceImpl implements SftpAccountService {

    private final SftpAccountRepo sftpAccountRepo;
    private final UserRepo userRepo;
    private final SubscriptionRepo subscriptionRepo;

    // ==========================
    // CREATE SFTP ACCOUNT
    // ==========================
    public SftpAccountDto createSftpAccount(SftpAccountDto dto)
            throws IOException, InterruptedException {

        Optional<User> userOpt = userRepo.findById(dto.getUserId());
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        User user = userOpt.get();

        Subscription activeSub = subscriptionRepo
                .findByUserId(user.getId())
                .stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.active)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active subscription"));

        int maxSftp = activeSub.getPlan().getMaxFtpAccounts();
        long currentCount = sftpAccountRepo.countByUserId(user.getId());

        if (currentCount >= maxSftp) {
            throw new RuntimeException("SFTP limit exceeded");
        }

        String homeDir = "/var/sftp/" + dto.getUsername();

        // 🔥 1️⃣ nejdřív vytvoříme OS usera
        ProcessBuilder pb = new ProcessBuilder(
                "sh",
                "Script/create-sftp-user.sh",
                dto.getUsername(),
                dto.getPassword(),
                homeDir
        );

        pb.redirectErrorStream(true);
        Process process = pb.start();

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException("Failed to create SFTP user in system");
        }

        // 🔥 2️⃣ až teď uložíme do DB
        SftpAccount account = new SftpAccount();
        account.setUser(user);
        account.setSftpUsername(dto.getUsername());
        account.setCreatedAt(LocalDateTime.now());
        account.setHomeDirectory(homeDir);

        SftpAccount saved = sftpAccountRepo.save(account);

        SftpAccountDto response = new SftpAccountDto();
        response.setId(saved.getId());
        response.setUserId(user.getId());
        response.setUsername(saved.getSftpUsername());
        response.setHomeDirectory(saved.getHomeDirectory());

        return response;
    }

    // ==========================
    // GET ALL FOR USER
    // ==========================
    public List<SftpAccountDto> getUserSftpAccounts(Long userId) {
        return sftpAccountRepo.findByUserId(userId)
                .stream()
                .map(acc -> {
                    SftpAccountDto dto = new SftpAccountDto();
                    dto.setId(acc.getId());
                    dto.setUserId(acc.getUser().getId());
                    dto.setUsername(acc.getSftpUsername());
                    dto.setHomeDirectory(acc.getHomeDirectory());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public void deleteSftpAccount(Long id) {
        sftpAccountRepo.deleteById(id);
    }
}
