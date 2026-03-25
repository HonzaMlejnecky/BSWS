package cz.hostingcentrum.Interface;

import cz.hostingcentrum.DTO.CustomerDatabaseDTO;
import java.util.List;

public interface CustomerDatabaseService {
    CustomerDatabaseDTO createDatabase(String dbName, String dbUser, String password);
    List<CustomerDatabaseDTO> getCurrentUserDatabases();
    void deleteDatabase(Long dbId);
    void updateDatabasePassword(Long dbId, String newPassword);
}
