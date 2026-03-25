package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.LoginDto;
import cz.hostingcentrum.DTO.RegisterDto;
import cz.hostingcentrum.Model.User;
import cz.hostingcentrum.Service.UserServiceImpl;
import cz.hostingcentrum.generated.api.AuthApi;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class AuthController implements AuthApi {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final UserServiceImpl userServiceImpl;

    @Override
    public ResponseEntity<String> login(LoginDto authDTO) {
        log.debug("Login attempt for email: {}", authDTO.getEmail());
        User user = userServiceImpl.findByEmail(authDTO.getEmail());
        if (user != null && user.getCode() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("First verified your email");
        }

        String token = userServiceImpl.verify(authDTO);
        if (token != null) {
            log.info("Login successful for email: {}", authDTO.getEmail());
            return ResponseEntity.ok(token);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @Override
    public ResponseEntity<Void> register(RegisterDto authDto) {
        log.debug("Registration attempt for email: {}", authDto.getEmail());
        userServiceImpl.register(authDto);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> verifyEmail(String code, String email) {
        boolean isVerified = userServiceImpl.verifyEmail(email, code);
        if (isVerified) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create("http://frontend.local?login=1"));
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        }
        return ResponseEntity.badRequest().build();
    }
}
