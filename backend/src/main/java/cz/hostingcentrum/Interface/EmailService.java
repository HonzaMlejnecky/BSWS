package cz.hostingcentrum.Interface;

import jakarta.mail.MessagingException;

import java.io.File;

public interface EmailService {
    void registationMail(String email, String code);
    void setupMail(String sender, String recipient, String subject, String text, File attachment) throws MessagingException;
}
