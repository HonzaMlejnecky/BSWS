package cz.hostingcentrum.Service;

import cz.hostingcentrum.DTO.LoginDto;
import cz.hostingcentrum.DTO.RegisterDto;
import cz.hostingcentrum.Enum.Role;
import cz.hostingcentrum.Config.EncryptedKeyService;
import cz.hostingcentrum.Config.JwtService;
import cz.hostingcentrum.Interface.UserService;
import cz.hostingcentrum.Model.User;
import cz.hostingcentrum.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepo userRepo;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final EncryptedKeyService encryptedKeyService;
    private final EmailServiceImpl emailServiceImpl;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Override
    public User findByEmail(String email) {
        return userRepo.findByEmail(email).orElse(null);
    }

    @Override
    public String verify(LoginDto authDto) {
        log.debug("Verifying user credentials for email: {}", authDto.getEmail());
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(authDto.getEmail(), authDto.getPassword())
        );

        if (authentication.isAuthenticated()) {
            log.info("User authenticated successfully: {}", authDto.getEmail());

            // Update last login timestamp
            User user = findByEmail(authDto.getEmail());
            if (user != null) {
                user.setLastLoginAt(LocalDateTime.now());
                userRepo.save(user);
            }

            return jwtService.generateToken(authDto.getEmail());
        } else {
            log.warn("Authentication failed for user: {}", authDto.getEmail());
            return "fail";
        }
    }

    @Override
    public void register(RegisterDto auth) {
        log.info("Registering new user: {}", auth.getEmail());

        if (userRepo.findByEmail(auth.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        if (auth.getUsername() != null && userRepo.findByUsername(auth.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already taken");
        }

        User user = new User();
        user.setRole(Role.customer);
        user.setEmail(auth.getEmail());
        user.setUsername(auth.getUsername());
        user.setFirstName(auth.getFirstName());
        user.setLastName(auth.getLastName());
        user.setPhone(auth.getPhone());
        user.setStreet(auth.getStreet());
        user.setCity(auth.getCity());
        user.setPostalCode(auth.getPostalCode());
        user.setCountry(auth.getCountry() != null ? auth.getCountry() : "CZ");
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(encoder.encode(auth.getPassword()));

        // Generate activation code
        String activationCode = encryptedKeyService.generateActivationCode() + "";
        user.setCode(encryptedKeyService.encrypt(activationCode));

        // Send verification email
        emailServiceImpl.registationMail(user.getEmail(), user.getCode());

        userRepo.save(user);
        log.info("User registered successfully: {}", auth.getEmail());
    }

    @Override
    public boolean verifyEmail(String email, String code) {
        log.debug("Verifying email for user: {}", email);
        User user = findByEmail(email);

        if (user != null && Objects.equals(
                encryptedKeyService.decrypt(user.getCode()),
                encryptedKeyService.decrypt(code))
        ) {
            user.setCode(null);
            userRepo.save(user);
            log.info("Email verified successfully for user: {}", email);
            return true;
        }

        log.warn("Email verification failed for user: {}", email);
        return false;
    }
}