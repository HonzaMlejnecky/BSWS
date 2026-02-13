package cz.hostingcentrum.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void setupMail(String sender, String recipient, String subject, String text, File attachment) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("noreply@hostingcentrum.cz");

        System.out.println(sender);
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
        }

        mailSender.send(message);
    }


    public void registationMail(String email, String code) {

        String verificationUrl = String.format("http://localhost:8080/api/v1/auth/verify/email?code=%s&email=%s", code, email);
        System.out.println(verificationUrl);
        String subject = "Ověření e-mailové adresy pro dokončení registrace";

        String text =
                "<h2>Ověření e-mailové adresy</h2>" +
                        "<p>Dobrý den,</p>" +
                        "<p>děkujeme za registraci do naší webhostingové aplikace HostingCentrum.</p>" +
                        "<p>Pro dokončení registrace a aktivaci vašeho účtu je nutné ověřit vaši e-mailovou adresu. " +
                        "Tímto krokem zajistíme, že byla e-mailová adresa zadána správně a že jste jejím oprávněným vlastníkem.</p>" +
                        String.format(
                                "<p>Pro ověření klikněte na následující odkaz: " +
                                        "<a href='%s'>Ověřit e-mailovou adresu</a></p>",
                                verificationUrl
                        ) +
                        "<p>Pokud jste se neregistrovali, můžete tento e-mail ignorovat.</p>" +
                        "<p>S pozdravem,<br/>Tým HostingCentrum</p>";

        try {
            setupMail(null, email,"\uD83D\uDD11" + subject, text, null);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

}
