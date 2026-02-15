package cz.hostingcentrum.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    public void setupMail(String sender, String recipient, String subject, String text, File attachment) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("noreply@hostingcentrum.cz");

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


    public void registationMail(String email, String code) {

        String verificationUrl = String.format("http://localhost:8080/api/v1/auth/verify/email?code=%s&email=%s", code, email);
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

}
