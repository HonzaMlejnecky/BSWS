package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.LoginDto;
import cz.hostingcentrum.DTO.RegisterDto;
import cz.hostingcentrum.Model.User;
import cz.hostingcentrum.Service.UserServiceImpl;
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
    private final UserServiceImpl userServiceImpl;

    @PostMapping("/login")
    @Operation(
            summary = "User login",
            description = "Authenticates user credentials and returns a JWT token if valid."
    )
    public ResponseEntity<?> login(@RequestBody LoginDto authDTO) {
        log.debug("Login attempt for email: {}", authDTO.getEmail());
        User user = userServiceImpl.findByEmail(authDTO.getEmail());
        if(user != null && user.getCode() != null) {
            log.warn("Login failed - email not verified: {}", authDTO.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("First verified your email");
        }
        String token = userServiceImpl.verify(authDTO);
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
    public ResponseEntity<?> register(@RequestBody RegisterDto authDto) {
        log.debug("Registration attempt for email: {}", authDto.getEmail());
        userServiceImpl.register(authDto);
        log.info("New user registered: {}", authDto.getEmail());
        return ResponseEntity.ok("Account created successfully. Please check your email for verification.");
    }

    @GetMapping("/verify/email")
    @Operation(
            summary = "Email verification",
            description = "Verifies user email after registration and redirects to login page."
    )
    public ResponseEntity<?> verifyEmail(@RequestParam("code") String code, @RequestParam("email") String email) {
        boolean isVerified = userServiceImpl.verifyEmail(email, code);
        log.debug("Email verification attempt: email={}, verified={}", email, isVerified);
        if (isVerified) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create("http://frontend.local?login=1"));
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        } else {
            return ResponseEntity.badRequest().body("Invalid verification code or email.");
        }
    }

}
