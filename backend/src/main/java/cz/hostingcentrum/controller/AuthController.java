package cz.hostingcentrum.controller;

import cz.hostingcentrum.DTO.AuthDTO;
import cz.hostingcentrum.Enum.Role;
import cz.hostingcentrum.model.User;
import cz.hostingcentrum.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;

    @PostMapping("/login")
    @Operation(
            summary = "User login",
            description = "Authenticates user credentials and returns a JWT token if valid."
    )
    public ResponseEntity<?> login(@RequestBody AuthDTO authDTO) {
        log.debug("Login attempt for email: {}", authDTO.getEmail());
        Optional<User> user = userService.findByEmail(authDTO.getEmail());
        if(user.isPresent() && user.get().getCode() != null) {
            log.warn("Login failed - email not verified: {}", authDTO.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("First verified your email");
        }
        String token = userService.verify(authDTO);
        if (token != null) {
            log.info("Login successful for email: {}", authDTO.getEmail());
            return ResponseEntity.ok(token);
        } else {
            log.warn("Login failed - invalid credentials: {}", authDTO.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    @Operation(
            summary = "Register new user",
            description = "Creates a new user account, sends verification email and saves to database."
    )
    public ResponseEntity<?> register(@RequestBody AuthDTO authDto) {
        log.debug("Registration attempt for email: {}", authDto.getEmail());
        Optional<User> existingUser = userService.findByEmail(authDto.getEmail());

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            authDto.setRole(user.getRole().name());
            userService.register(authDto);
            log.info("User registration updated for existing email: {}", authDto.getEmail());
            return ResponseEntity.ok("Account created successfully. Please check your email for verification.");
        } else {
            authDto.setRole(String.valueOf(Role.USER));
            userService.register(authDto);
            log.info("New user registered: {}", authDto.getEmail());
            return ResponseEntity.ok("Account created successfully. Please check your email for verification.");
        }
    }

    @GetMapping("/verify/email")
    @Operation(
            summary = "Email verification",
            description = "Verifies user email after registration and redirects to login page."
    )
    public ResponseEntity<?> verifyEmail(@RequestParam("code") String code, @RequestParam("email") String email) {
        boolean isVerified = userService.verifyEmail(email, code);
        log.debug("Email verification attempt: email={}, verified={}", email, isVerified);
        if (isVerified) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create("http://localhost/login"));
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        } else {
            return ResponseEntity.badRequest().body("Invalid verification code or email.");
        }
    }

}
