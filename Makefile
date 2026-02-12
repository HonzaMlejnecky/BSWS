# ==============================================================================
# BSWS - Makefile
#
# Pouziti:
#   make start     - Prvni spusteni
#   make update    - Stahni zmeny a restartuj
#   make stop      - Zastav vse
#   make reset     - Reset DB (smaze data!)
#   make logs      - Zobraz logy
#   make db        - Pripoj se k databazi
# ==============================================================================

.PHONY: start update stop reset logs db backend web status help

# Vychozi cil
help:
	@echo "Pouziti:"
	@echo "  make start   - Prvni spusteni projektu"
	@echo "  make update  - Stahni zmeny a restartuj"
	@echo "  make stop    - Zastav vsechny kontejnery"
	@echo "  make reset   - Reset DB (SMAZE DATA!)"
	@echo "  make logs    - Zobraz logy"
	@echo "  make db      - Pripoj se k databazi"
	@echo "  make status  - Stav kontejneru"

# Prvni spusteni
start:
	@if [ ! -f .env ]; then cp .env.example .env; fi
	docker compose up -d --build
	@echo ""
	@echo "Cekam na spusteni..."
	@sleep 10
	@docker compose ps
	@echo ""
	@echo "Hotovo! Otevri http://localhost"

# Aktualizace
update:
	@./scripts/update.sh

# Zastaveni
stop:
	docker compose down

# Reset DB
reset:
	docker compose down -v
	docker compose up -d --build
	@echo "DB resetovana."

# Logy
logs:
	docker compose logs -f

# Logy backendu
logs-backend:
	docker compose logs -f backend

# Pripojeni k DB
db:
	docker exec -it hc-db mariadb -u platform_user -pplatformpass123 hosting_platform

# Rebuild backendu
backend:
	docker compose up -d --build backend

# Restart webu
web:
	docker compose restart web

# Stav
status:
	docker compose ps

# Cisteni Docker
clean:
	docker compose down -v
	docker system prune -f
