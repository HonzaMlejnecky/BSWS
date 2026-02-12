# Hostingove centrum BSWS

Semestralni prace — hostingove centrum postavene na Dockeru.

> **Novy v projektu?** Zacni s [docs/GETTING-STARTED.md](docs/GETTING-STARTED.md) - kompletni navod krok za krokem.

## Rychly start

```bash
# 1. Klonuj a prejdi do slozky
git clone <url>
cd BSWS

# 2. Spust (automaticky vytvori .env)
./scripts/start.sh          # Mac/Linux
.\scripts\start.ps1         # Windows PowerShell
# nebo: make start

# 3. Otevri http://localhost
```

## Aktualizace (po pullnuti zmen od kolegu)

```bash
./scripts/update.sh         # Mac/Linux
.\scripts\update.ps1        # Windows PowerShell
# nebo: make update
```

Skript automaticky detekuje co se zmenilo a provede spravne akce (rebuild, restart, reset DB...).

**Otevri v prohlizeci:**
- http://localhost - hlavni web
- http://localhost:8080 - backend API

## Architektura

```
Prohlizec
    |
    v
Apache (:80) ─── reverse proxy ───> Spring Boot (:8080) ──> MariaDB (:3307)
    |
    +── servuje zakaznicke weby z /srv/customers/{user}/www

FTP (:21) ──> /srv/customers/{user}/
Mailpit (:8025 web, :1025 SMTP)
```

## Sluzby

| Sluzba | Kontejner | Port | Stav |
|--------|-----------|------|------|
| Apache (proxy) | `hc-web` | 80 | Aktivni |
| Spring Boot | `hc-backend` | 8080 | Aktivni |
| MariaDB | `hc-db` | 3307 | Aktivni |
| FTP | `hc-ftp` | 21 | Zakomentovano |
| Mail | `hc-mail` | 8025 | Zakomentovano |

## Pristupy

| Co | Kde | Udaje |
|----|-----|-------|
| API | http://localhost:8080 | — |
| Web | http://localhost | — |
| Databaze | localhost:3307 | `platform_user` / `platformpass123` |

## Prikazy

### Pomoci skriptu (doporuceno)

| Akce | Mac/Linux | Windows | Make |
|------|-----------|---------|------|
| Prvni spusteni | `./scripts/start.sh` | `.\scripts\start.ps1` | `make start` |
| Aktualizace | `./scripts/update.sh` | `.\scripts\update.ps1` | `make update` |
| Zastavit | - | - | `make stop` |
| Reset DB | - | - | `make reset` |
| Logy | - | - | `make logs` |
| Pripojit k DB | - | - | `make db` |

### Rucne (docker compose)

```bash
docker compose up -d              # Spustit
docker compose up -d --build      # Spustit + rebuild
docker compose down               # Zastavit
docker compose down -v            # Zastavit + smazat DB
docker compose logs -f            # Logy
docker compose logs -f backend    # Logy backendu
docker compose restart web        # Restart Apache
docker compose ps                 # Stav kontejneru
```

### Databaze

```bash
# Pripojit se
docker exec -it hc-db mariadb -u platform_user -pplatformpass123 hosting_platform

# Uvnitr: SHOW TABLES; SELECT * FROM users; exit;
```

## Konflikt portu?

Uprav v `.env`:
```bash
WEB_PORT=8000        # misto 80
BACKEND_PORT=8081    # misto 8080
DB_PORT=3308         # misto 3307
```

## Dokumentace

| Dokument | Popis |
|----------|-------|
| [docs/GETTING-STARTED.md](docs/GETTING-STARTED.md) | Kompletni navod pro zacatecniky |
| [docs/ROZDELENI-PRACE.md](docs/ROZDELENI-PRACE.md) | Kdo co dela (8 lidi) |
| [docs/UKOLY-BACKEND.md](docs/UKOLY-BACKEND.md) | Ukoly pro tym Backend |
| [docs/UKOLY-FRONTEND.md](docs/UKOLY-FRONTEND.md) | Ukoly pro tym Frontend |
| [docs/UKOLY-DATABAZE.md](docs/UKOLY-DATABAZE.md) | Ukoly pro tym Databaze |
| [docs/UKOLY-WEBSERVER.md](docs/UKOLY-WEBSERVER.md) | Ukoly pro tym Webserver |
| [docs/UKOLY-FTP.md](docs/UKOLY-FTP.md) | Ukoly pro tym FTP |
| [docs/UKOLY-MAIL.md](docs/UKOLY-MAIL.md) | Ukoly pro tym Mail |

## Struktura projektu

```
BSWS/
├── docker-compose.yml      # Orchestrace
├── .env.example            # Sablona konfigurace
├── backend/                # Spring Boot
├── frontend/               # React/Next.js (prazdne)
├── web/                    # Apache config
├── db/                     # SQL skripty
├── ftp/                    # FTP config
├── mail/                   # Mail config
├── customers/              # Zakaznicke weby
└── docs/                   # Dokumentace
```

## Licence

| Produkt | Licence |
|---------|---------|
| Apache HTTP Server | Apache License 2.0 |
| Spring Boot | Apache License 2.0 |
| MariaDB | GPL v2 |
| Pure-FTPd | BSD |
| Mailpit | MIT |
| Docker | Apache License 2.0 |
