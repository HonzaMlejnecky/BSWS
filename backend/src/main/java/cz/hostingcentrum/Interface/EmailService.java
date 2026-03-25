package cz.hostingcentrum.Interface;

import cz.hostingcentrum.DTO.CreateEmailDomainDTO;
import cz.hostingcentrum.DTO.EmailAccountDTO;
import cz.hostingcentrum.DTO.EmailDomainDTO;
import jakarta.mail.MessagingException;

import java.io.File;
import java.util.List;

public interface EmailService {
    void registationMail(String email, String code);
    void setupMail(String sender, String recipient, String subject, String text, File attachment) throws MessagingException;

    CreateEmailDomainDTO createDomain(CreateEmailDomainDTO dto);
    List<EmailDomainDTO> getCurrentUserDomains();
    void deleteDomain(Long domainId);
    EmailAccountDTO createEmailAccount(EmailAccountDTO dto);
    List<EmailAccountDTO> getAccountsByDomain(Long domainId);
    void deleteEmailAccount(Long accountId);
    void changeEmailPassword(Long accountId, String newPassword);
}
