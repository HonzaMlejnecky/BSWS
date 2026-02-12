package cz.hostingcentrum.service;

import cz.hostingcentrum.DTO.AuthDTO;
import cz.hostingcentrum.Enum.Role;
import cz.hostingcentrum.config.EncryptedKeyService;
import cz.hostingcentrum.config.JwtService;
import cz.hostingcentrum.model.User;
import cz.hostingcentrum.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
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
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(authDto.getEmail(), authDto.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(authDto.getEmail());
        } else {
            return "fail";
        }
    }


    public void register(AuthDTO auth) {
        User user = new User();
        user.setRole(Role.USER);
        user.setEmail(auth.getEmail());
        user.setDateRegister(LocalDate.now());
        user.setPassword(encoder.encode(auth.getPassword()));
        user.setCode(encryptedKeyService.encrypt(encryptedKeyService.generateActivationCode() + ""));
        emailService.registationMail(user.getEmail(), user.getCode());
        userRepo.save(user);
    }


    public boolean verifyEmail(String email, String code) {
        Optional<User> optionalUser = findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (Objects.equals(encryptedKeyService.decrypt(user.getCode()), encryptedKeyService.decrypt(code))) {
                user.setCode(null);
                userRepo.save(user);
                return true;
            }
        }
        return false;
    }
}
