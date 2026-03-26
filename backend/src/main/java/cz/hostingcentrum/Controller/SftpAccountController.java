package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.SftpAccChangePassDTO;
import cz.hostingcentrum.DTO.SftpAccountDto;
import cz.hostingcentrum.Interface.SftpAccountService;
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

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SftpAccountController {

    private final SftpAccountService service;

    @PostMapping("/api/v1/sftp/accounts/password")
    public ResponseEntity<String> updateSftpPassword(@Valid @RequestBody SftpAccChangePassDTO dto) {
        service.updateSftpPassword(dto.getAccountId(), dto.getNewPassword());
        return ResponseEntity.ok("Password updated successfully");
    }

    @PostMapping("/api/v1/sftp/accounts")
    public ResponseEntity<SftpAccountDto> createSftpAccount(@Valid @RequestBody SftpAccountDto dto) throws IOException, InterruptedException {
        return new ResponseEntity<>(service.createSftpAccount(dto), HttpStatus.CREATED);
    }

    @GetMapping("/api/v1/sftp/accounts/me")
    public ResponseEntity<List<SftpAccountDto>> getSftpAccountsByUser() {
        return new ResponseEntity<>(service.getCurrentUserSftpAccounts(), HttpStatus.OK);
    }

    @DeleteMapping("/api/v1/sftp/accounts/{id}")
    public ResponseEntity<Void> deleteSftpAccount(@PathVariable Long id) {
        service.deleteSftpAccount(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
