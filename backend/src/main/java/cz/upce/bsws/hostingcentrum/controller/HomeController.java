package cz.upce.bsws.hostingcentrum.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Zakladni controller pro testovani.
 *
 * TYM BACKEND: Pridejte dalsi controllery do tohoto balicku.
 * Struktura:
 *   - AuthController     - registrace, login, logout
 *   - UserController     - sprava uzivatelu
 *   - OrderController    - objednavky hostingu
 *   - DomainController   - sprava domen
 *   - FtpController      - FTP ucty
 *   - DatabaseController - zakaznicke databaze
 */
@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> index() {
        return Map.of(
            "service", "Hosting Centrum API",
            "version", "1.0.0",
            "status", "running",
            "timestamp", LocalDateTime.now().toString()
        );
    }

    @GetMapping("/api/status")
    public Map<String, Object> status() {
        return Map.of(
            "status", "ok",
            "database", "connected",
            "timestamp", LocalDateTime.now().toString()
        );
    }
}
