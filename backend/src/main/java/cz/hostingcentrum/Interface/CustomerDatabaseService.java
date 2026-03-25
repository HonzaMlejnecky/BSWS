package cz.hostingcentrum.Interface;

import cz.hostingcentrum.DTO.CustomerDatabaseDTO;
import java.util.List;

public interface CustomerDatabaseService {
    CustomerDatabaseDTO createDatabase(Long userId, String dbName, String dbUser, String password);
    List<CustomerDatabaseDTO> getUserDatabases(Long userId);
    void deleteDatabase(Long dbId);
    void updateDatabasePassword(Long dbId, String newPassword);
}