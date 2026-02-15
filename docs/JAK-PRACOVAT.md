# Jak pracovat s projektem

Tento navod je urceny pro vsechny cleny tymu - vcetne tech, kteri s Dockerem nebo Spring Bootem nikdy nepracovali.

---

## Pred zacatkem - co potrebujes

### 1. Nainstaluj Docker Desktop

| Platforma | Odkaz |
|-----------|-------|
| Windows | https://docs.docker.com/desktop/install/windows-install/ |
| Mac | https://docs.docker.com/desktop/install/mac-install/ |
| Linux | https://docs.docker.com/desktop/install/linux-install/ |

**Po instalaci:**
- Spust Docker Desktop
- Pockej az se spusti (ikona v systray prestane animovat)
- Musi bezet na pozadi kdyz pracujes s projektem!

### 2. Nainstaluj Git

https://git-scm.com/downloads

### 3. Stahni projekt

```bash
git clone https://github.com/VAS-USERNAME/BSWS.git
cd BSWS
```

---

## Denni prace - zakladni prikazy

> **TIP:** Vsechny prikazy spoustej v terminalu ve slozce projektu (BSWS/).

### Prvni spusteni (jen jednou)

```bash
make start
```

Co to udela:
- Vytvori `.env` soubor (konfigurace)
- Stahne Docker images (muze trvat 5-10 minut)
- Spusti vsechny sluzby
- Na konci ukaze kde co bezi

### Spusteni (kdyz uz mas projekt stazeny)

```bash
make start
```

### Zastaveni

```bash
make stop
```

### Restart (kdyz neco nefunguje)

```bash
make restart
```

### Zjistit stav (co bezi?)

```bash
make status
```

Mel bys videt neco jako:
```
NAME          STATUS
hc-db         Up (healthy)
hc-backend    Up (healthy)
hc-web        Up
```

---

## Kde co najdu?

Po spusteni (`make start`) mas k dispozici:

| Co | Adresa | Popis |
|----|--------|-------|
| **Hlavni web** | http://localhost | Apache proxy |
| **Backend API** | http://localhost:8080 | Spring Boot |
| **Swagger** | http://localhost:8080/swagger-ui.html | API dokumentace |
| **Emaily** | http://localhost:8025 | Zachycene emaily (Mailpit) |
| **phpMyAdmin** | http://localhost:8081 | Sprava databaze (GUI) |

---

## Prace s databazi

### Chci se podivat na data (GUI)

1. Otevri http://localhost:8081 (phpMyAdmin)
2. Prihlaseni:
   - Server: `db`
   - Uzivatel: `platform_user`
   - Heslo: `platformpass123`
3. Vyber databazi `hosting_platform`

### Chci se podivat na data (terminal)

```bash
make db
```

Uvnitr pis SQL prikazy:
```sql
SHOW TABLES;
SELECT * FROM users;
exit;
```

### Chci videt tabulky rychle

```bash
make db-tables
```

### Chci videt uzivatele

```bash
make db-users
```

### Chci smazat vsechna data a zacit znovu

```bash
make reset
```

**POZOR:** Toto smaze VSECHNA data! Pouzij jen kdyz je neco uplne rozbite.

---

## Prace s kodem

### Udelal jsem zmenu v backendu (Java)

```bash
make backend
```

Toto znovu sestavi a spusti backend.

### Udelal jsem zmenu v Apache konfiguraci

```bash
make web
```

### Stahl jsem nove zmeny od kolegu

```bash
git pull
make backend
```

---

## Sledovani logu (co se deje?)

### Vsechny logy najednou

```bash
make logs
```

Ukonci pomoci `Ctrl+C`

### Jen logy backendu

```bash
make logs-backend
```

### Jen logy databaze

```bash
make logs-db
```

### Jen logy Apache

```bash
make logs-web
```

---

## Testovani

### Testovat registraci

1. Otevri http://localhost:8080/swagger-ui.html
2. Najdi `POST /api/v1/auth/register`
3. Klikni "Try it out"
4. Zadej:
```json
{
  "email": "test@test.cz",
  "password": "heslo123"
}
```
5. Klikni "Execute"
6. Mel bys dostat odpoved "Ucet byl uspesne dokoncen..."

### Zkontrolovat email

1. Otevri http://localhost:8025
2. Uvidis zachyceny email s verifikacnim odkazem

### Testovat login

1. Nejdriv klikni na verifikacni odkaz v emailu
2. Pak v Swaggeru `POST /api/v1/auth/login`:
```json
{
  "email": "test@test.cz",
  "password": "heslo123"
}
```
3. Dostanes JWT token (dlouhy text)

### Testovaci ucty (uz existuji v DB)

| Email | Heslo | Role |
|-------|-------|------|
| admin@hostingcentrum.cz | admin123 | Admin |
| jan.novak@mojefirma.cz | test1234 | Zakaznik |

---

## Prace s Git

### Pred zacatkem prace

```bash
git pull
```

### Po dokonceni zmeny

```bash
git add .
git commit -m "Popis co jsem udelal"
git push
```

### Vytvoreni vlastni vetve (doporuceno)

```bash
git checkout -b feature/moje-zmena
# ... udelej zmeny ...
git add .
git commit -m "Popis zmeny"
git push -u origin feature/moje-zmena
```

---

## Reseni problemu

### "Port already in use"

Neco jineho pouziva port 80, 8080, nebo 3307.

**Reseni:** Uprav `.env` soubor:
```bash
WEB_PORT=8000
BACKEND_PORT=8081
DB_PORT=3308
```

Pak:
```bash
make stop
make start
```

### "Cannot connect to database"

Databaze jeste nenastartovala.

**Reseni:**
```bash
make status      # Pockej az bude db "healthy"
make restart     # Nebo restartuj vse
```

### "Backend nefunguje"

```bash
make logs-backend   # Podivej se na chyby
make backend        # Zkus restart
```

### "Nic nefunguje"

```bash
make reset    # Smaze vse a zacne znovu
```

### "Docker Desktop nereaguje"

1. Restartuj Docker Desktop
2. Pockej 1 minutu
3. `make start`

---

## Prehled vsech prikazu

```bash
make help
```

| Prikaz | Co dela |
|--------|---------|
| `make start` | Spusti projekt |
| `make stop` | Zastavi projekt |
| `make restart` | Restartuje vse |
| `make status` | Ukaze co bezi |
| `make logs` | Ukaze logy |
| `make backend` | Restartuje backend |
| `make web` | Restartuje Apache |
| `make db` | Pripoji k databazi |
| `make db-tables` | Ukaze tabulky |
| `make db-users` | Ukaze uzivatele |
| `make reset` | SMAZE vsechna data! |
| `make logs-backend` | Logy backendu |
| `make logs-web` | Logy Apache |
| `make logs-db` | Logy databaze |

---

## Struktura projektu (co kde je)

```
BSWS/
├── docker-compose.yml    # Definice vsech sluzeb
├── Makefile              # Zkratky pro prikazy
├── .env                  # Konfigurace (hesla, porty)
│
├── backend/              # Java Spring Boot aplikace
│   ├── src/main/java/    # Java kod
│   └── src/main/resources/
│       ├── application.yml           # Konfigurace
│       └── db/migration/             # SQL migrace
│           ├── V1__create_schema.sql # Tabulky
│           └── V2__seed_data.sql     # Testovaci data
│
├── web/                  # Apache konfigurace
│   └── apache-config/
│       ├── httpd.conf    # Hlavni config
│       └── vhosts.conf   # Virtualni hosty
│
├── customers/            # Slozky zakazniku (weby)
│   ├── user_2/www/
│   └── user_3/www/
│
└── docs/                 # Dokumentace
```

---

## Slovnicek pojmu

| Pojem | Co to je |
|-------|----------|
| **Docker** | Nastroj ktery spusti aplikace v "kontejnerech" (jako virtualni pocitace) |
| **Kontejner** | Izlovana aplikace (napr. databaze, backend) |
| **Image** | Sablona pro kontejner (stahne se z internetu) |
| **Volume** | Uloziste dat kontejneru (prezije restart) |
| **Spring Boot** | Java framework pro tvorbu webovych aplikaci |
| **MariaDB** | Databaze (jako MySQL) |
| **Apache** | Webovy server |
| **Flyway** | Nastroj pro spravu databazovych zmen |
| **JWT** | Token pro prihlaseni (JSON Web Token) |
| **API** | Rozhrani pro komunikaci mezi aplikacemi |
| **Swagger** | Nastroj pro testovani a dokumentaci API |

---

## Potrebujes pomoc?

1. Podivej se do logu: `make logs-backend`
2. Restartuj: `make restart`
3. Pokud nic nepomaha: `make reset`
4. Zeptej se v tymu
