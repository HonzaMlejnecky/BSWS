package cz.upce.bsws.hostingcentrum.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Konfigurace Spring Security.
 *
 * TYM BACKEND: Toto je DOCASNA konfigurace pro vyvoj.
 * Pred produkci NUTNE upravit:
 *   - Pridat autentizaci (JWT, session, ...)
 *   - Omezit pristup k admin endpointum
 *   - Zapnout CSRF pro formulare
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // DOCASNE: Povol vse pro vyvoj
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )
            // DOCASNE: Vypni CSRF pro API testovani
            .csrf(csrf -> csrf.disable());

        return http.build();
    }
}
