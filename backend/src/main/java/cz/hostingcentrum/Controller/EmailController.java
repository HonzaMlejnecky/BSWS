package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.ChangeEmailPasswordDTO;
import cz.hostingcentrum.DTO.CreateEmailDomainDTO;
import cz.hostingcentrum.DTO.EmailAccountDTO;
import cz.hostingcentrum.DTO.EmailDomainDTO;
import cz.hostingcentrum.Interface.EmailService;
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
public class EmailController {

    private final EmailService service;

    @PostMapping("/api/v1/email/domains")
    public ResponseEntity<CreateEmailDomainDTO> createDomain(@Valid @RequestBody CreateEmailDomainDTO dto) {
        return new ResponseEntity<>(service.createDomain(dto), HttpStatus.CREATED);
    }

    @GetMapping("/api/v1/email/domains/me")
    public ResponseEntity<List<EmailDomainDTO>> getDomainsByUser() {
        return ResponseEntity.ok(service.getCurrentUserDomains());
    }

    @DeleteMapping("/api/v1/email/domains/{id}")
    public ResponseEntity<Void> deleteDomain(@PathVariable Long id) {
        service.deleteDomain(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/v1/email/accounts")
    public ResponseEntity<EmailAccountDTO> createAccount(@Valid @RequestBody EmailAccountDTO dto) {
        return new ResponseEntity<>(service.createEmailAccount(dto), HttpStatus.CREATED);
    }

    @GetMapping("/api/v1/email/accounts/domain/{domainId}")
    public ResponseEntity<List<EmailAccountDTO>> getAccountsByDomain(@PathVariable Long domainId) {
        return ResponseEntity.ok(service.getAccountsByDomain(domainId));
    }

    @DeleteMapping("/api/v1/email/accounts/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        service.deleteEmailAccount(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/v1/email/accounts/password")
    public ResponseEntity<String> changeEmailPassword(@Valid @RequestBody ChangeEmailPasswordDTO dto) {
        service.changeEmailPassword(dto.getAccountId(), dto.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }
}
