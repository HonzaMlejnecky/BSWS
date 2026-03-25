package cz.hostingcentrum.Service;

import cz.hostingcentrum.DTO.CustomerDatabaseDTO;
import cz.hostingcentrum.Enum.SubscriptionStatus;
import cz.hostingcentrum.Interface.CustomerDatabaseService;
import cz.hostingcentrum.Model.CustomerDatabase;
import cz.hostingcentrum.Model.Subscription;
import cz.hostingcentrum.Model.User;
import cz.hostingcentrum.Repository.CustomerDatabaseRepo;
import cz.hostingcentrum.Repository.SubscriptionRepo;
import cz.hostingcentrum.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerDatabaseServiceImpl implements CustomerDatabaseService {

    private final CustomerDatabaseRepo databaseRepo;
    private final UserRepo userRepo;
    private final SubscriptionRepo subscriptionRepo;
    private final JdbcTemplate rootJdbcTemplate; // pro fyzickou DB operaci

    @Override
    public CustomerDatabaseDTO createDatabase(Long userId, String dbName, String dbUser, String password) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subscription activeSub = subscriptionRepo
                .findByUserId(user.getId())
                .stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.active)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active subscription"));

        int maxDb = activeSub.getPlan().getMaxDatabases();
        long currentCount = databaseRepo.countByUserId(user.getId());

        if (currentCount >= maxDb) {
            throw new RuntimeException("Database limit exceeded for this user");
        }

        // Vytvoření fyzické databáze
        try {
            rootJdbcTemplate.execute("CREATE DATABASE `" + dbName + "`;");
            rootJdbcTemplate.execute("CREATE USER '" + dbUser + "'@'%' IDENTIFIED BY '" + password + "';");
            rootJdbcTemplate.execute("GRANT ALL PRIVILEGES ON `" + dbName + "`.* TO '" + dbUser + "'@'%';");
            rootJdbcTemplate.execute("FLUSH PRIVILEGES;");
        } catch (Exception e) {
            throw new RuntimeException("Failed to create physical database or user", e);
        }

        CustomerDatabase db = CustomerDatabase.builder()
                .dbName(dbName)
                .dbUser(dbUser)
                .user(user)
                .createdAt(LocalDateTime.now())
                .build();

        CustomerDatabase saved = databaseRepo.save(db);

        return CustomerDatabaseDTO.builder()
                .id(saved.getId())
                .dbName(saved.getDbName())
                .dbUser(saved.getDbUser())
                .userId(user.getId())
                .build();
    }

    @Override
    public List<CustomerDatabaseDTO> getUserDatabases(Long userId) {
        return databaseRepo.findByUserId(userId)
                .stream()
                .map(db -> CustomerDatabaseDTO.builder()
                        .id(db.getId())
                        .dbName(db.getDbName())
                        .dbUser(db.getDbUser())
                        .userId(db.getUser().getId())
                        .build())
                .toList();
    }

    @Override
    public void updateDatabasePassword(Long dbId, String newPassword) {
        CustomerDatabase db = databaseRepo.findById(dbId)
                .orElseThrow(() -> new RuntimeException("Database not found"));

        // Změna hesla fyzického DB uživatele
        try {
            rootJdbcTemplate.execute("ALTER USER '" + db.getDbUser() + "'@'%' IDENTIFIED BY '" + newPassword + "';");
            rootJdbcTemplate.execute("FLUSH PRIVILEGES;");
        } catch (Exception e) {
            throw new RuntimeException("Failed to update database user password", e);
        }

        db.setUpdatedAt(LocalDateTime.now());
        databaseRepo.save(db);
    }

    @Override
    public void deleteDatabase(Long dbId) {
        CustomerDatabase db = databaseRepo.findById(dbId)
                .orElseThrow(() -> new RuntimeException("Database not found"));

        // Odstranění fyzické databáze
        try {
            rootJdbcTemplate.execute("DROP DATABASE `" + db.getDbName() + "`;");
            rootJdbcTemplate.execute("DROP USER '" + db.getDbUser() + "'@'%';");
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete physical database or user", e);
        }

        databaseRepo.delete(db);
    }
}