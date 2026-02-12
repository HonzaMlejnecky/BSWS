package cz.hostingcentrum;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Hlavni trida Hosting Centrum aplikace.
 *
 * TYM BACKEND: Toto je vstupni bod aplikace.
 * Pridavejte komponenty do prislusnych balicku:
 *   - controller/ - REST API endpointy
 *   - service/    - Business logika
 *   - repository/ - Databazove operace
 *   - model/      - Entity a DTO
 *   - config/     - Konfigurace (Security, CORS, ...)
 */

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
