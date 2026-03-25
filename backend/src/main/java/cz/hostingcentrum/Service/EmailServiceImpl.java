package cz.hostingcentrum.Service;

import cz.hostingcentrum.DTO.CreateEmailDomainDTO;
import cz.hostingcentrum.DTO.EmailAccountDTO;
import cz.hostingcentrum.DTO.EmailDomainDTO;
import cz.hostingcentrum.Interface.EmailService;
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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

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

    @Override
    public void setupMail(String sender, String recipient, String subject, String text, File attachment) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("postmaster@magehosting.cz");

        log.debug("Preparing email - sender: {}, recipient: {}, subject: {}", sender, recipient, subject);
        if (sender != null) {
            helper.setReplyTo(sender);
        }

        if (subject != null) {
            helper.setSubject(subject);
        }
        helper.setTo(recipient);
        helper.setText(text, true);

        if (attachment != null) {
            helper.addAttachment(attachment.getName(), attachment);
            log.debug("Attachment added: {}", attachment.getName());
        }

        mailSender.send(message);
        log.debug("Email sent successfully to: {}", recipient);
    }


    @Override
    public void registationMail(String email, String code) {

        String verificationUrl = String.format("http://api.local/api/v1/auth/verify/email?code=%s&email=%s", code, email);
        log.info("Sending verification email to {} with URL: {}", email, verificationUrl);
        String subject = "Email Verification - Complete Your Registration";

        String text =
                "<h2>Email Verification</h2>" +
                        "<p>Hello,</p>" +
                        "<p>Thank you for registering with HostingCentrum.</p>" +
                        "<p>To complete your registration and activate your account, please verify your email address. " +
                        "This ensures that the email address was entered correctly and that you are its rightful owner.</p>" +
                        String.format(
                                "<p>Click the following link to verify: " +
                                        "<a href='%s'>Verify Email Address</a></p>",
                                verificationUrl
                        ) +
                        "<p>If you did not register, you can safely ignore this email.</p>" +
                        "<p>Best regards,<br/>HostingCentrum Team</p>";

        try {
            setupMail(null, email,"\uD83D\uDD11" + subject, text, null);
            log.info("Verification email sent successfully to: {}", email);
        } catch (MessagingException e) {
            log.error("Failed to send verification email to {}: {}", email, e.getMessage());
            throw new RuntimeException("Failed to send verification email", e);
        }
    }


    @Override
    public CreateEmailDomainDTO createDomain(CreateEmailDomainDTO dto) {

        String domainName = dto.getDomainName().toLowerCase();
        if (!domainName.endsWith(".com") && !domainName.endsWith(".cz")) {
            throw new IllegalArgumentException("Doména musí končit na .com nebo .cz");
        }

        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        EmailDomain domain = new EmailDomain();
        domain.setDomainName(dto.getDomainName());
        domain.setUser(user);
        domain.setIsActive(true);

        emailDomainRepo.save(domain);

        // 🔥 iRedMail sync (domain table)
        iredmailJdbc.update("""
            INSERT INTO vmail.domain (domain, active)
            VALUES (?, 1)
        """, dto.getDomainName());

        dto.setId(domain.getId());
        return dto;
    }

    @Override
    public List<EmailDomainDTO> getDomainsByUser(Long userId) {
        return emailDomainRepo.findByUserId(userId)
                .stream()
                .map(d -> {

                    EmailDomainDTO dto = new EmailDomainDTO();
                    dto.setId(d.getId());
                    dto.setDomainName(d.getDomainName());
                    dto.setUserId(d.getUser().getId());
                    dto.setIsActive(d.getIsActive());

                    List<EmailAccountDTO> accounts = emailAccountRepo
                            .findByEmailDomainId(d.getId())
                            .stream()
                            .map(a -> {
                                EmailAccountDTO accDto = new EmailAccountDTO();
                                accDto.setId(a.getId());
                                accDto.setDomainId(d.getId());
                                accDto.setEmailAddress(a.getEmailAddress());
                                accDto.setIsActive(a.getIsActive());
                                return accDto;
                            })
                            .toList();

                    dto.setAccounts(accounts);

                    return dto;
                })
                .toList();
    }

    @Override
    public void deleteDomain(Long domainId) {
        EmailDomain domain = emailDomainRepo.findById(domainId)
                .orElseThrow();

        // iRedMail delete
        iredmailJdbc.update("DELETE FROM vmail.domain WHERE domain = ?", domain.getDomainName());

        emailDomainRepo.delete(domain);
    }

    // ================= EMAIL =================

    @Override
    public EmailAccountDTO createEmailAccount(EmailAccountDTO dto) {

        EmailDomain domain = emailDomainRepo.findById(dto.getDomainId())
                .orElseThrow(() -> new RuntimeException("Domain not found"));

        EmailAccount acc = new EmailAccount();
        acc.setEmailDomain(domain);
        acc.setEmailAddress(dto.getEmailAddress());
        acc.setIsActive(true);

        emailAccountRepo.save(acc);

        // 🔥 iRedMail mailbox insert
        String passwordHash = generateSSHA512(dto.getPassword());

        String localPart = dto.getEmailAddress().split("@")[0];

        iredmailJdbc.update("""
            INSERT INTO vmail.mailbox
            (username, password, name, maildir, quota, domain, active, created, modified)
            VALUES (?, ?, ?, ?, 0, ?, 1, NOW(), NOW())
        """,
                dto.getEmailAddress(),              // username
                passwordHash,                       // password
                dto.getEmailAddress(),              // name
                domain.getDomainName() + "/" + localPart + "/", // maildir
                domain.getDomainName()              // domain
        );

        dto.setId(acc.getId());
        return dto;
    }

    @Override
    public List<EmailAccountDTO> getAccountsByDomain(Long domainId) {
        return emailAccountRepo.findByEmailDomainId(domainId)
                .stream()
                .map(a -> {
                    EmailAccountDTO dto = new EmailAccountDTO();
                    dto.setId(a.getId());
                    dto.setDomainId(a.getEmailDomain().getId());
                    dto.setEmailAddress(a.getEmailAddress());
                    dto.setIsActive(a.getIsActive());
                    return dto;
                }).toList();
    }

    @Override
    public void deleteEmailAccount(Long accountId) {

        EmailAccount acc = emailAccountRepo.findById(accountId)
                .orElseThrow();

        // iRedMail delete
        iredmailJdbc.update("DELETE FROM vmail.mailbox WHERE username = ?", acc.getEmailAddress());

        emailAccountRepo.delete(acc);
    }

    private String generateSSHA512(String password) {
        try {
            // 1. vytvoření salt (náhodná data)
            byte[] salt = new byte[16];
            SecureRandom random = new SecureRandom();
            random.nextBytes(salt);

            // 2. SHA512(password + salt)
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            md.update(password.getBytes(StandardCharsets.UTF_8));
            md.update(salt);

            byte[] digest = md.digest();

            // 3. spojení digest + salt
            byte[] digestPlusSalt = new byte[digest.length + salt.length];
            System.arraycopy(digest, 0, digestPlusSalt, 0, digest.length);
            System.arraycopy(salt, 0, digestPlusSalt, digest.length, salt.length);

            // 4. base64 encoding
            String base64 = Base64.getEncoder().encodeToString(digestPlusSalt);

            // 5. finální formát pro Dovecot
            return "{SSHA512}" + base64;

        } catch (Exception e) {
            throw new RuntimeException("Error generating SSHA512 hash", e);
        }
    }

    @Override
    public void changeEmailPassword(Long accountId, String newPassword) {
        // 1️⃣ Najdi účet
        EmailAccount acc = emailAccountRepo.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Email account not found"));

        // 2️⃣ Vygeneruj SSHA512 hash
        String passwordHash = generateSSHA512(newPassword);

        // 3️⃣ Vypočti maildir (local_part)
        String localPart = acc.getEmailAddress().split("@")[0];

        // 4️⃣ Aktualizuj v iRedMail databázi
        iredmailJdbc.update("""
            UPDATE vmail.mailbox
            SET password = ?
            WHERE username = ?
        """,
                passwordHash,
                acc.getEmailAddress()
        );

        log.info("Password changed for email account: {}", acc.getEmailAddress());
    }

}
