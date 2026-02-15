package cz.hostingcentrum.service;

import cz.hostingcentrum.DTO.AuthDTO;
import cz.hostingcentrum.Enum.Role;
import cz.hostingcentrum.config.EncryptedKeyService;
import cz.hostingcentrum.config.JwtService;
import cz.hostingcentrum.model.User;
import cz.hostingcentrum.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepo userRepo;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final EncryptedKeyService  encryptedKeyService;
    private final EmailService emailService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public Optional<User> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public String verify(AuthDTO authDto) {
        log.debug("Verifying user credentials for email: {}", authDto.getEmail());
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(authDto.getEmail(), authDto.getPassword()));
        if (authentication.isAuthenticated()) {
            log.info("User authenticated successfully: {}", authDto.getEmail());
            return jwtService.generateToken(authDto.getEmail());
        } else {
            log.warn("Authentication failed for user: {}", authDto.getEmail());
            return "fail";
        }
    }


    public void register(AuthDTO auth) {
        log.info("Registering new user: {}", auth.getEmail());
        User user = new User();
        user.setRole(Role.USER);
        user.setEmail(auth.getEmail());
        user.setCreatedAt(LocalDate.now());
        user.setPasswordHash(encoder.encode(auth.getPassword()));
        user.setCode(encryptedKeyService.encrypt(encryptedKeyService.generateActivationCode() + ""));
        emailService.registationMail(user.getEmail(), user.getCode());
        userRepo.save(user);
        log.info("User registered successfully: {}", auth.getEmail());
    }


    public boolean verifyEmail(String email, String code) {
        log.debug("Verifying email for user: {}", email);
        Optional<User> optionalUser = findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (Objects.equals(encryptedKeyService.decrypt(user.getCode()), encryptedKeyService.decrypt(code))) {
                user.setCode(null);
                userRepo.save(user);
                log.info("Email verified successfully for user: {}", email);
                return true;
            }
            log.warn("Invalid verification code for user: {}", email);
        } else {
            log.warn("User not found for email verification: {}", email);
        }
        return false;
    }
}
