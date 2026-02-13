package cz.hostingcentrum.controller;

import cz.hostingcentrum.DTO.AuthDTO;
import cz.hostingcentrum.Enum.Role;
import cz.hostingcentrum.model.User;
import cz.hostingcentrum.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
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

    private final UserService userService;

    @PostMapping("/login")
    @Operation(
            summary = "Přihlášení uživatele",
            description = "Během příhlášení dojde k ověření, jestli zadané údaje odpovídají a jestli uživatel v systému existuje. Po dokončení ověření se vrátí JWT token."
    )
    public ResponseEntity<?> login(@RequestBody AuthDTO authDTO) {
        Optional<User> user = userService.findByEmail(authDTO.getEmail());
        if(user.isPresent() && user.get().getCode() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("First verified your email");
        }
        String token = userService.verify(authDTO);
        if (token != null) {
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    @Operation(
            summary = "Registrace nového uživatele",
            description = "Vytvoří nového uživatele, pošle verifikační email a uloží do DB"
    )
    public ResponseEntity<?> register(@RequestBody AuthDTO authDto) {
        Optional<User> existingUser = userService.findByEmail(authDto.getEmail());

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            authDto.setRole(user.getRole().name());
            userService.register(authDto);
            return ResponseEntity.ok("Účet byl úspěšně dokončen. Zkontrolujte email pro ověření.");
        }else{
            authDto.setRole(String.valueOf(Role.USER));
            userService.register(authDto);
            return ResponseEntity.ok("Účet byl úspěšně dokončen. Zkontrolujte email pro ověření.");
        }
    }

    @GetMapping("/verify/email")
    @Operation(
            summary = "Ověření emailu po registraci",
            description = "Po dokončení registrace klient dostane na svůj email ověřovací odkaz a po rozkliknutí dojde k ověření emailu a přesměrování a stránku Login"
    )
    public ResponseEntity<?> verifyEmail(@RequestParam("code") String code, @RequestParam("email") String email) {
        boolean isVerified = userService.verifyEmail(email, code);
        System.out.println(email + " " + code + isVerified);
        if (isVerified) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create("http://localhost/login"));
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        } else {
            return ResponseEntity.badRequest().body("Invalid verification code or email.");
        }
    }

}
