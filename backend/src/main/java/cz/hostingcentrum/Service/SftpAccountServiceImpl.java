package cz.hostingcentrum.Service;

import cz.hostingcentrum.DTO.SftpAccountDto;
import cz.hostingcentrum.Enum.SubscriptionStatus;
import cz.hostingcentrum.Interface.SftpAccountService;
import cz.hostingcentrum.Interface.SftpgoApiService;
import cz.hostingcentrum.Model.SftpAccount;
import cz.hostingcentrum.Model.Subscription;
import cz.hostingcentrum.Model.User;
import cz.hostingcentrum.Repository.SftpAccountRepo;
import cz.hostingcentrum.Repository.SubscriptionRepo;
import cz.hostingcentrum.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SftpAccountServiceImpl implements SftpAccountService {

    private final SftpAccountRepo sftpAccountRepo;
    private final UserRepo userRepo;
    private final SubscriptionRepo subscriptionRepo;
    private final SftpgoApiService sftpgoApiService;


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
                .toList();
    }

    public void deleteSftpAccount(Long id) {

        SftpAccount account = sftpAccountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("SFTP account not found"));

        sftpgoApiService.deleteUser(account.getSftpUsername());

        Path homeDir = Paths.get("/srv/sftpgo/data", account.getUser().getId() + "/" + account.getSftpUsername());
        try {
            if (Files.exists(homeDir)) {
                Files.walk(homeDir)
                        .sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete home directory: " + homeDir, e);
        }

        sftpAccountRepo.delete(account);
    }

    public void updateSftpPassword(Long accountId, String newPassword) {

        SftpAccount account = sftpAccountRepo.findById(accountId)
                .orElseThrow(() -> new RuntimeException("SFTP account not found"));

        // Zavolá API pro změnu hesla
        sftpgoApiService.updateUserPassword(account.getSftpUsername(), newPassword);
        account.setUpdatedAt(LocalDateTime.now());
        sftpAccountRepo.save(account);
    }

    public SftpAccountDto createSftpAccount(SftpAccountDto dto) {

        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

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

        String homeDir = "/srv/sftpgo/data/" + user.getId() + "/" + dto.getHomeDirectory();
        File dir = new File(homeDir);
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            if (!created) {
                throw new RuntimeException("Failed to create home directory: " + homeDir);
            }
        }

        sftpgoApiService.createUser(
                dto.getUsername(),
                dto.getPassword(),
                homeDir
        );

        SftpAccount account = new SftpAccount();
        account.setUser(user);
        account.setSftpUsername(dto.getUsername());
        account.setCreatedAt(LocalDateTime.now());
        account.setIsActive(true);
        account.setHomeDirectory(homeDir);

        SftpAccount saved = sftpAccountRepo.save(account);

        SftpAccountDto response = new SftpAccountDto();
        response.setId(saved.getId());
        response.setUserId(user.getId());
        response.setUsername(saved.getSftpUsername());
        response.setHomeDirectory(saved.getHomeDirectory());

        return response;
    }
}