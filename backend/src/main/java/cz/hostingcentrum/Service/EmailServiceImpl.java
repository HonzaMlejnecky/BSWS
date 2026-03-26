package cz.hostingcentrum.Service;

import cz.hostingcentrum.DTO.CreateEmailDomainDTO;
import cz.hostingcentrum.DTO.EmailAccountDTO;
import cz.hostingcentrum.DTO.EmailDomainDTO;
import cz.hostingcentrum.Interface.EmailService;
import cz.hostingcentrum.Mapper.EmailMapper;
import cz.hostingcentrum.Model.EmailAccount;
import cz.hostingcentrum.Model.EmailDomain;
import cz.hostingcentrum.Model.User;
import cz.hostingcentrum.Repository.EmailAccountRepo;
import cz.hostingcentrum.Repository.EmailDomainRepo;
import cz.hostingcentrum.Repository.UserRepo;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);
    private final JavaMailSender mailSender;
    private final EmailAccountRepo emailAccountRepo;
    private final EmailDomainRepo emailDomainRepo;
    private final JdbcTemplate iredmailJdbc;
    private final UserRepo userRepo;
    private final EmailMapper emailMapper;

    @Value("${app.verification.base-url:http://localhost:8080}")
    private String verificationBaseUrl;

    @Override
    public void setupMail(String sender, String recipient, String subject, String text, File attachment) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("postmaster@magehosting.cz");
        if (sender != null) helper.setReplyTo(sender);
        if (subject != null) helper.setSubject(subject);
        helper.setTo(recipient);
        helper.setText(text, true);
        if (attachment != null) helper.addAttachment(attachment.getName(), attachment);
        mailSender.send(message);
    }

    @Override
    public void registationMail(String email, String code) {
        String verificationUrl = UriComponentsBuilder
                .fromUriString(verificationBaseUrl)
                .path("/api/v1/auth/verify/email")
                .queryParam("code", code)
                .queryParam("email", email)
                .build()
                .toUriString();
        String text = "<h2>Email Verification</h2><p>Hello,</p><p>Thank you for registering with HostingCentrum.</p>" +
                String.format("<p>Click the following link to verify: <a href='%s'>Verify Email Address</a></p>", verificationUrl);
        try {
            setupMail(null, email, "\uD83D\uDD11Email Verification - Complete Your Registration", text, null);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    @Override
    public CreateEmailDomainDTO createDomain(CreateEmailDomainDTO dto) {
        String domainName = dto.getDomainName().toLowerCase();
        if (!domainName.endsWith(".com") && !domainName.endsWith(".cz")) {
            throw new IllegalArgumentException("Doména musí končit na .com nebo .cz");
        }

        User user = getCurrentUser();
        EmailDomain domain = emailMapper.toDomainEntity(dto);
        domain.setDomainName(domainName);
        domain.setUser(user);
        domain.setIsActive(true);
        EmailDomain saved = emailDomainRepo.save(domain);

        iredmailJdbc.update("""
            INSERT INTO vmail.domain (domain, active)
            VALUES (?, 1)
        """, saved.getDomainName());

        return emailMapper.toCreateDomainDto(saved);
    }

    @Override
    public List<EmailDomainDTO> getCurrentUserDomains() {
        User user = getCurrentUser();
        return emailDomainRepo.findByUserId(user.getId()).stream().map(domain -> {
            EmailDomainDTO dto = emailMapper.toDomainDto(domain);
            List<EmailAccountDTO> accounts = emailAccountRepo.findByEmailDomainId(domain.getId()).stream().map(emailMapper::toAccountDto).toList();
            dto.setAccounts(accounts);
            return dto;
        }).toList();
    }

    @Override
    public void deleteDomain(Long domainId) {
        EmailDomain domain = emailDomainRepo.findById(domainId).orElseThrow();
        ensureDomainOwner(domain);
        iredmailJdbc.update("DELETE FROM vmail.domain WHERE domain = ?", domain.getDomainName());
        emailDomainRepo.delete(domain);
    }

    @Override
    public EmailAccountDTO createEmailAccount(EmailAccountDTO dto) {
        EmailDomain domain = emailDomainRepo.findById(dto.getDomainId()).orElseThrow(() -> new RuntimeException("Domain not found"));
        ensureDomainOwner(domain);
        EmailAccount acc = emailMapper.toAccountEntity(dto);
        acc.setEmailDomain(domain);
        acc.setIsActive(true);
        EmailAccount saved = emailAccountRepo.save(acc);

        String passwordHash = generateSSHA512(dto.getPassword());
        String localPart = dto.getEmailAddress().split("@")[0];
        iredmailJdbc.update("""
            INSERT INTO vmail.mailbox
            (username, password, name, maildir, quota, domain, active, created, modified)
            VALUES (?, ?, ?, ?, 0, ?, 1, NOW(), NOW())
        """, dto.getEmailAddress(), passwordHash, dto.getEmailAddress(), domain.getDomainName() + "/" + localPart + "/", domain.getDomainName());

        return emailMapper.toAccountDto(saved);
    }

    @Override
    public List<EmailAccountDTO> getAccountsByDomain(Long domainId) {
        return emailAccountRepo.findByEmailDomainId(domainId).stream().map(emailMapper::toAccountDto).toList();
    }

    @Override
    public void deleteEmailAccount(Long accountId) {
        EmailAccount acc = emailAccountRepo.findById(accountId).orElseThrow();
        ensureDomainOwner(acc.getEmailDomain());
        iredmailJdbc.update("DELETE FROM vmail.mailbox WHERE username = ?", acc.getEmailAddress());
        emailAccountRepo.delete(acc);
    }

    private String generateSSHA512(String password) {
        try {
            byte[] salt = new byte[16];
            SecureRandom random = new SecureRandom();
            random.nextBytes(salt);
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            md.update(password.getBytes(StandardCharsets.UTF_8));
            md.update(salt);
            byte[] digest = md.digest();
            byte[] digestPlusSalt = new byte[digest.length + salt.length];
            System.arraycopy(digest, 0, digestPlusSalt, 0, digest.length);
            System.arraycopy(salt, 0, digestPlusSalt, digest.length, salt.length);
            return "{SSHA512}" + Base64.getEncoder().encodeToString(digestPlusSalt);
        } catch (Exception e) {
            throw new RuntimeException("Error generating SSHA512 hash", e);
        }
    }

    @Override
    public void changeEmailPassword(Long accountId, String newPassword) {
        EmailAccount acc = emailAccountRepo.findById(accountId).orElseThrow(() -> new RuntimeException("Email account not found"));
        ensureDomainOwner(acc.getEmailDomain());
        iredmailJdbc.update("""
            UPDATE vmail.mailbox
            SET password = ?
            WHERE username = ?
        """, generateSSHA512(newPassword), acc.getEmailAddress());
        log.info("Password changed for email account: {}", acc.getEmailAddress());
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return userRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private void ensureDomainOwner(EmailDomain domain) {
        User currentUser = getCurrentUser();
        if (!domain.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot modify another user's email resources");
        }
    }
}
