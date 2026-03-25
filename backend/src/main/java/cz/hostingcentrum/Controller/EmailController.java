package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.ChangeEmailPasswordDTO;
import cz.hostingcentrum.DTO.CreateEmailDomainDTO;
import cz.hostingcentrum.DTO.EmailAccountDTO;
import cz.hostingcentrum.DTO.EmailDomainDTO;
import cz.hostingcentrum.Interface.EmailService;
import cz.hostingcentrum.generated.api.EmailApi;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EmailController implements EmailApi {

    private final EmailService service;

    @Override
    public ResponseEntity<CreateEmailDomainDTO> createDomain(CreateEmailDomainDTO dto) {
        return new ResponseEntity<>(service.createDomain(dto), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<List<EmailDomainDTO>> getDomainsByUser() {
        return ResponseEntity.ok(service.getCurrentUserDomains());
    }

    @Override
    public ResponseEntity<Void> deleteDomain(Long id) {
        service.deleteDomain(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<EmailAccountDTO> createAccount(EmailAccountDTO dto) {
        return new ResponseEntity<>(service.createEmailAccount(dto), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<List<EmailAccountDTO>> getAccountsByDomain(Long domainId) {
        return ResponseEntity.ok(service.getAccountsByDomain(domainId));
    }

    @Override
    public ResponseEntity<Void> deleteAccount(Long id) {
        service.deleteEmailAccount(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<String> changeEmailPassword(ChangeEmailPasswordDTO dto) {
        service.changeEmailPassword(dto.getAccountId(), dto.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }
}
