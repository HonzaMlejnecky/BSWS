package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.ChangePassDbDTO;
import cz.hostingcentrum.DTO.CreateDbDTO;
import cz.hostingcentrum.DTO.CustomerDatabaseDTO;
import cz.hostingcentrum.Interface.CustomerDatabaseService;
import cz.hostingcentrum.generated.api.DatabaseApi;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DatabaseController implements DatabaseApi {

    private final CustomerDatabaseService databaseService;

    @Override
    public ResponseEntity<CustomerDatabaseDTO> createDatabase(CreateDbDTO createDbDTO) {
        CustomerDatabaseDTO dto = databaseService.createDatabase(createDbDTO.getUserId(), createDbDTO.getDbName(), createDbDTO.getPassword(), createDbDTO.getPassword());
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<List<CustomerDatabaseDTO>> getUserDatabases(Long userId) {
        return ResponseEntity.ok(databaseService.getUserDatabases(userId));
    }

    @Override
    public ResponseEntity<Void> deleteDatabase(Long dbId) {
        databaseService.deleteDatabase(dbId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    public ResponseEntity<String> updateDatabasePassword(ChangePassDbDTO dto) {
        databaseService.updateDatabasePassword(dto.getDatabaseId(), dto.getNewPassword());
        return ResponseEntity.ok("Database password updated successfully");
    }
}
