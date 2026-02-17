# ==============================================================================
# BSWS - Makefile
#
# Zkracene prikazy pro praci s projektem.
# Pouziti: make <prikaz>
#
# Zobraz napovedu: make help
# ==============================================================================

.PHONY: help start stop restart reset logs status \
        backend web db ftp mail \
        logs-backend logs-web logs-db \
        db-cli db-root db-tables db-users \
        build clean prune

# ------------------------------------------------------------------------------
# NAPOVEDA
# ------------------------------------------------------------------------------
help:
	@echo ""
	@echo "  BSWS - Zkracene prikazy"
	@echo "  ========================"
	@echo ""
	@echo "  ZAKLADNI:"
	@echo "    make start      - Prvni spusteni projektu"
	@echo "    make stop       - Zastavit vsechny kontejnery"
	@echo "    make restart    - Restartovat vsechny kontejnery"
	@echo "    make status     - Zobrazit stav kontejneru"
	@echo "    make logs       - Sledovat logy (vsechny)"
	@echo ""
	@echo "  VYVOJ:"
	@echo "    make backend    - Rebuild a restart backendu"
	@echo "    make web        - Restart Apache (po zmene config)"
	@echo "    make build      - Rebuild vsech kontejneru"
	@echo ""
	@echo "  DATABAZE:"
	@echo "    make reset      - RESET DB (smaze data!) + restart"
	@echo "    make db         - Pripojit se k DB (platform_user)"
	@echo "    make init_db    - Inicializuji DB (DROP, CREATE, INSERT)"
	@echo "    make db-root    - Pripojit se k DB (root)"
	@echo "    make db-tables  - Zobrazit vsechny tabulky"
	@echo "    make db-users   - Zobrazit uzivatele v DB"
	@echo ""
	@echo "  LOGY:"
	@echo "    make logs-backend  - Logy backendu"
	@echo "    make logs-web      - Logy Apache"
	@echo "    make logs-db       - Logy databaze"
	@echo ""
	@echo "  SLUZBY (zakomentovane):"
	@echo "    make ftp        - Spustit FTP server"
	@echo "    make mail       - Spustit Mail server"
	@echo ""
	@echo "  CISTENI:"
	@echo "    make clean      - Zastavit a smazat kontejnery"
	@echo "    make prune      - Vycistit Docker (uvolni misto)"
	@echo ""

# ------------------------------------------------------------------------------
# ZAKLADNI PRIKAZY
# ------------------------------------------------------------------------------

# Prvni spusteni
start:
	@if [ ! -f .env ]; then cp .env.example .env; echo "Vytvoren .env soubor"; fi
	@echo "Spoustim kontejnery..."
	@docker compose up -d --build
	@echo ""
	@echo "Cekam na spusteni (30s)..."
	@sleep 30
	@docker compose ps
	@echo ""
	@echo "========================================"
	@echo "  HOTOVO!"
	@echo "  Web:     http://localhost"
	@echo "  API:     http://localhost:8080"
	@echo "  DB:      localhost:3307"
	@echo "========================================"

# Zastavit
stop:
	@echo "Zastavuji kontejnery..."
	@docker compose down
	@echo "Hotovo."

# Restartovat vse
restart:
	@echo "Restartuji kontejnery..."
	@docker compose restart
	@echo "Hotovo."

# Stav
status:
	@docker compose ps

# Vsechny logy
logs:
	@docker compose logs -f

# ------------------------------------------------------------------------------
# VYVOJ - JEDNOTLIVE SLUZBY
# ------------------------------------------------------------------------------

# Rebuild backendu (po zmene Java kodu)
backend:
	@echo "Rebuilduji backend..."
	@docker compose up -d --build backend
	@docker compose ps backend
	@echo "Backend restartovan."

# Rebuild frontendu
frontend:
	@echo "Rebuilduji frontend..."
	@docker compose up -d --build frontend
	@docker compose ps frontend
	@echo "Frontend restartovan."

# Restart Apache (po zmene configu)
web:
	@echo "Restartuji Apache..."
	@docker compose restart web
	@echo "Apache restartovan."

# Rebuild vsech kontejneru
build:
	@echo "Rebuilduji vsechny kontejnery..."
	@docker compose up -d --build
	@echo "Hotovo."

# ------------------------------------------------------------------------------
# DATABAZE
# ------------------------------------------------------------------------------

# Reset DB (SMAZE VSECHNA DATA!)
reset:
	@echo "!!! POZOR: Toto smaze vsechna data v databazi !!!"
	@echo "Stiskni Ctrl+C pro zruseni, nebo pockat 5s..."
	@sleep 5
	@echo "Mazem databazi..."
	@docker compose down -v
	@echo "Spoustim znovu..."
	@docker compose up -d --build
	@echo "Cekam na inicializaci DB (30s)..."
	@sleep 30
	@docker compose ps
	@echo "DB resetovana."

# Pripojit k DB jako platform_user
db:
	@docker exec -it hc-db mariadb -u platform_user -pplatformpass123 hosting_platform

# Drop/create schema a insert dat
init_db:
	@echo "Inicializuji schema a data..."
	@docker exec -i hc-db mariadb -u platform_user -pplatformpass123 hosting_platform < db/init/03-drop.sql
	@docker exec -i hc-db mariadb -u platform_user -pplatformpass123 hosting_platform < db/init/01-schema.sql
	@docker exec -i hc-db mariadb -u platform_user -pplatformpass123 hosting_platform < db/init/02-seed.sql
	@echo "Databaze inicializovana."

# Pripojit k DB jako root
db-root:
	@docker exec -it hc-db mariadb -u root -prootpass123

# Zobrazit tabulky
db-tables:
	@docker exec hc-db mariadb -u platform_user -pplatformpass123 hosting_platform -e "SHOW TABLES;"

# Zobrazit uzivatele
db-users:
	@docker exec hc-db mariadb -u platform_user -pplatformpass123 hosting_platform -e "SELECT id, username, email, role FROM users;"

# Zobrazit plany
db-plans:
	@docker exec hc-db mariadb -u platform_user -pplatformpass123 hosting_platform -e "SELECT id, code, name, price_monthly FROM hosting_plans;"

# Zobrazit objednavky
db-orders:
	@docker exec hc-db mariadb -u platform_user -pplatformpass123 hosting_platform -e "SELECT o.id, u.username, p.code as plan, o.status FROM orders o JOIN users u ON o.user_id = u.id JOIN hosting_plans p ON o.plan_id = p.id;"

# ------------------------------------------------------------------------------
# LOGY JEDNOTLIVYCH SLUZEB
# ------------------------------------------------------------------------------

logs-backend:
	@docker compose logs -f backend

logs-web:
	@docker compose logs -f web

logs-db:
	@docker compose logs -f db

# ------------------------------------------------------------------------------
# VOLITELNE SLUZBY (zakomentovane v docker-compose)
# ------------------------------------------------------------------------------

# Spustit FTP server (musi byt odkomentovan v docker-compose.yml)
ftp:
	@echo "Spoustim FTP server..."
	@docker compose up -d ftp
	@echo "FTP server spusten na portu 21."

# Spustit Mail server (musi byt odkomentovan v docker-compose.yml)
mail:
	@echo "Spoustim Mail server..."
	@docker compose up -d mail
	@echo "Mail server spusten."
	@echo "  SMTP: localhost:1025"
	@echo "  Web:  http://localhost:8025"

# Spustit phpMyAdmin
phpmyadmin:
	@echo "Spoustim phpMyAdmin..."
	@docker compose up -d phpmyadmin
	@echo "phpMyAdmin: http://localhost:8081"

# ------------------------------------------------------------------------------
# CISTENI
# ------------------------------------------------------------------------------

# Zastavit a smazat kontejnery (zachova DB data)
clean:
	@echo "Zastavuji a mazem kontejnery..."
	@docker compose down
	@echo "Hotovo."

# Vycistit Docker (uvolni misto na disku)
prune:
	@echo "Cistim Docker (nepouzite images, kontejnery, site)..."
	@docker system prune -f
	@echo "Hotovo."

# Kompletni vycisteni (SMAZE VSECHNA DATA!)
purge:
	@echo "!!! POZOR: Toto smaze VSECHNA data vcetne DB !!!"
	@echo "Stiskni Ctrl+C pro zruseni, nebo pockat 5s..."
	@sleep 5
	@docker compose down -v
	@docker system prune -af
	@echo "Vse smazano."

# ------------------------------------------------------------------------------
# TESTOVANI
# ------------------------------------------------------------------------------

# Test ze backend odpovida
test-api:
	@echo "Testuji API..."
	@curl -s http://localhost:8080/ | head -1
	@echo ""
	@echo "API funguje."

# Test zakaznickych webu
test-web:
	@echo "Testuji zakaznicke weby..."
	@echo "mojefirma.cz:"
	@curl -s -H "Host: www.mojefirma.cz" http://localhost/ | grep "<title>" || echo "  CHYBA"
	@echo "druhafirma.cz:"
	@curl -s -H "Host: www.druhafirma.cz" http://localhost/ | grep "<title>" || echo "  CHYBA"
	@echo ""
	@echo "Hotovo."

# Kompletni test
test: test-api test-web
	@echo "Vsechny testy OK."
