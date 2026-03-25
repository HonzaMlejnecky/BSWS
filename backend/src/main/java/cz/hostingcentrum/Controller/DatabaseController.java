package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.ChangePassDbDTO;
import cz.hostingcentrum.DTO.CreateDbDTO;
import cz.hostingcentrum.DTO.CustomerDatabaseDTO;
import cz.hostingcentrum.Interface.CustomerDatabaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/database")
@RequiredArgsConstructor
public class DatabaseController {

    private final CustomerDatabaseService databaseService;

    @PostMapping("/create")
    public ResponseEntity<CustomerDatabaseDTO> createDatabase(@RequestBody CreateDbDTO createDbDTO) {

        CustomerDatabaseDTO dto = databaseService.createDatabase(createDbDTO.getUserId(), createDbDTO.getDbName(), createDbDTO.getPassword(), createDbDTO.getPassword());
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CustomerDatabaseDTO>> getUserDatabases(@PathVariable Long userId) {
        List<CustomerDatabaseDTO> dbs = databaseService.getUserDatabases(userId);
        return ResponseEntity.ok(dbs);
    }

    @DeleteMapping("/{dbId}")
    public ResponseEntity<Void> deleteDatabase(@PathVariable Long dbId) {
        databaseService.deleteDatabase(dbId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/update-password")
    public ResponseEntity<String> updateDatabasePassword(
            @RequestBody ChangePassDbDTO dto) {

        databaseService.updateDatabasePassword(dto.getDatabaseId(), dto.getNewPassword());
        return ResponseEntity.ok("Database password updated successfully");
    }
}