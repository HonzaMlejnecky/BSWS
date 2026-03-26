package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.ChangePassDbDTO;
import cz.hostingcentrum.DTO.CreateDbDTO;
import cz.hostingcentrum.DTO.CustomerDatabaseDTO;
import cz.hostingcentrum.Interface.CustomerDatabaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DatabaseController {

    private final CustomerDatabaseService databaseService;

    @PostMapping("/api/v1/databases")
    public ResponseEntity<CustomerDatabaseDTO> createDatabase(@Valid @RequestBody CreateDbDTO createDbDTO) {
        CustomerDatabaseDTO dto = databaseService.createDatabase(createDbDTO.getDbName(), createDbDTO.getUsername(), createDbDTO.getPassword());
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/api/v1/databases/me")
    public ResponseEntity<List<CustomerDatabaseDTO>> getUserDatabases() {
        return ResponseEntity.ok(databaseService.getCurrentUserDatabases());
    }

    @DeleteMapping("/api/v1/databases/{dbId}")
    public ResponseEntity<Void> deleteDatabase(@PathVariable Long dbId) {
        databaseService.deleteDatabase(dbId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/api/v1/databases/password")
    public ResponseEntity<String> updateDatabasePassword(@Valid @RequestBody ChangePassDbDTO dto) {
        databaseService.updateDatabasePassword(dto.getDatabaseId(), dto.getNewPassword());
        return ResponseEntity.ok("Database password updated successfully");
    }
}
