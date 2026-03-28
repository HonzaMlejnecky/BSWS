package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.LoginDto;
import cz.hostingcentrum.DTO.RegisterDto;
import cz.hostingcentrum.Service.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final UserServiceImpl userServiceImpl;

    @PostMapping("/api/v1/auth/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginDto authDTO) {
        log.debug("Login attempt for email: {}", authDTO.getEmail());
        String token = userServiceImpl.verify(authDTO);
        if (token != null) {
            log.info("Login successful for email: {}", authDTO.getEmail());
            return ResponseEntity.ok(token);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/api/v1/auth/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterDto authDto) {
        log.debug("Registration attempt for email: {}", authDto.getEmail());
        userServiceImpl.register(authDto);
        return ResponseEntity.ok().build();
    }
}
