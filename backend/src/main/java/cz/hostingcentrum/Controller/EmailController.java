package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.ChangeEmailPasswordDTO;
import cz.hostingcentrum.DTO.CreateEmailDomainDTO;
import cz.hostingcentrum.DTO.EmailAccountDTO;
import cz.hostingcentrum.DTO.EmailDomainDTO;
import cz.hostingcentrum.Interface.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService service;

    // ================= DOMAIN =================

    @PostMapping("/domain/create")
    public ResponseEntity<CreateEmailDomainDTO> createDomain(@RequestBody CreateEmailDomainDTO dto) {
        return new ResponseEntity<>(service.createDomain(dto), HttpStatus.CREATED);
    }

    @GetMapping("/domain/user/{userId}")
    public ResponseEntity<List<EmailDomainDTO>> getDomainsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getDomainsByUser(userId));
    }

    @DeleteMapping("/domain/{id}")
    public ResponseEntity<Void> deleteDomain(@PathVariable Long id) {
        service.deleteDomain(id);
        return ResponseEntity.noContent().build();
    }

    // ================= EMAIL ACCOUNTS =================

    @PostMapping("/account/create")
    public ResponseEntity<EmailAccountDTO> createAccount(@RequestBody EmailAccountDTO dto) {
        return new ResponseEntity<>(service.createEmailAccount(dto), HttpStatus.CREATED);
    }

    @GetMapping("/account/domain/{domainId}")
    public ResponseEntity<List<EmailAccountDTO>> getAccountsByDomain(@PathVariable Long domainId) {
        return ResponseEntity.ok(service.getAccountsByDomain(domainId));
    }

    @DeleteMapping("/account/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        service.deleteEmailAccount(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangeEmailPasswordDTO dto) {
        try {
            service.changeEmailPassword(dto.getAccountId(), dto.getNewPassword());
            return ResponseEntity.ok("Password changed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}