# Zadani a stav projektu

Semestralni prace: **Hostingove centrum**
Predmet: Sprava weboveho serveru (BSWS)

---

## Zadani

> Predmetem semestralni prace je vypracovani "Hostingoveho centra".
> Hostingove centrum bude vytvorene ve virtualnim prostredi (napr. Oracle VirtualBox).
> V ramci projektu musi byt respektovano licencni ujednani vsech dilcich produktu.

---

## Prehled plneni

| Pozadavek | Stav | Poznamka |
|-----------|------|----------|
| Virtualni server | ✅ HOTOVO | Docker (alternativa k VirtualBox) |
| Host zaznamy (etc/hosts) | ✅ HOTOVO | Navod + priklad |
| Instalace databaze | ✅ HOTOVO | MariaDB 11 |
| Instalace weboveho serveru | ✅ HOTOVO | Apache 2.4 |
| Instalace FTP serveru | ✅ HOTOVO | Pure-FTPd aktivovan |
| Obsluzna aplikace | ✅ HOTOVO | Spring Boot - registrace, login, plany, objednavky |
| SMTP server (volitelne) | ✅ HOTOVO | Mailpit (testovaci) |
| Dokumentace | ✅ HOTOVO | docs/ slozka |
| GitHub repozitar | ✅ HOTOVO | Verejny/privatni |

---

## Detailni stav

### 1. Virtualni server ✅

**Reseni:** Docker kontejnery (moderni alternativa k VirtualBox)

| Kontejner | Image | Port | Stav |
|-----------|-------|------|------|
| hc-db | mariadb:11 | 3307 | ✅ Aktivni |
| hc-backend | custom (Java 21) | 8080 | ✅ Aktivni |
| hc-web | httpd:2.4-alpine | 80 | ✅ Aktivni |
| hc-ftp | stilliard/pure-ftpd | 21 | ⏳ Pripraveno |
| mailserver | mailhog/mailhog | 8025, 1025 | ✅ Aktivni |
| hc-phpmyadmin | phpmyadmin:latest | 8081 | ✅ Aktivni |

**Spusteni:**
```bash
make start
```

---

### 2. Host zaznamy ✅

**Umisteni:** `/etc/hosts` (Linux/Mac) nebo `C:\Windows\System32\drivers\etc\hosts` (Windows)

**Priklad:**
```
127.0.0.1   www.mojefirma.cz mojefirma.cz
127.0.0.1   www.druhafirma.cz druhafirma.cz
127.0.0.1   www.tretifirma.cz tretifirma.cz
```

**Navod:** viz `docs/GETTING-STARTED.md` sekce 8

---

### 3. Databaze (MariaDB) ✅

| Polozka | Hodnota |
|---------|---------|
| Image | mariadb:11 |
| Databaze | hosting_platform |
| Uzivatel | platform_user / platformpass123 |
| Root | root / rootpass123 |
| Port | 3307 (externi), 3306 (interni) |

**Schema (10 tabulek):**
- `users` - uzivatele systemu
- `hosting_plans` - tarify
- `orders` - objednavky
- `domains` - domeny zakazniku
- `ftp_accounts` - FTP ucty
- `customer_databases` - zakaznicke databaze
- `email_accounts` - emailove schranky
- `payments` - platby
- `audit_logs` - audit log
- `flyway_schema_history` - historie migraci

**Migrace:** Flyway (automaticke pri startu)

---

### 4. Webovy server (Apache) ✅

| Polozka | Hodnota |
|---------|---------|
| Image | httpd:2.4-alpine |
| Port | 80 |
| Konfigurace | web/apache-config/ |

**Funkce:**
- Reverse proxy na backend (:8080)
- Servovani zakaznickych webu z /srv/customers/{user}/www
- Virtual hosts pro domeny

**Konfiguracni soubory:**
- `web/apache-config/httpd.conf` - hlavni konfigurace
- `web/apache-config/vhosts.conf` - virtualni hosty

---

### 5. FTP server (Pure-FTPd) ✅

**Stav:** Aktivni

| Polozka | Hodnota |
|---------|---------|
| Image | stilliard/pure-ftpd:latest |
| Port | 21, 30000-30009 (pasivni) |
| Uzivatel | ftpuser |
| Heslo | ftppass123 |
| Home | /srv/customers |

**Jak pouzit:**
```bash
# Spustit FTP server
make start

# Pripojit se (FileZilla nebo terminal)
ftp localhost
# Uzivatel: ftpuser
# Heslo: ftppass123
```

**Co je pripraveno:**
- [x] FTP kontejner aktivovan
- [x] Testovaci ucet
- [x] Pristup k zakaznickym slozkam

---

### 6. Obsluzna aplikace (Spring Boot) ✅

**Stav:** Funkcni - zakladni i rozsirena funkcionalita

#### HOTOVO ✅

| Funkce | Endpoint | Popis |
|--------|----------|-------|
| Registrace | POST /api/v1/auth/register | Vytvori ucet, posle email |
| Verifikace | GET /api/v1/auth/verify/email | Overi email |
| Prihlaseni | POST /api/v1/auth/login | Vrati JWT token |
| Seznam tarifu | GET /api/v1/plans | Vrati aktivni tarify |
| Detail tarifu | GET /api/v1/plans/{id} | Detail tarifu |
| Tarif podle kodu | GET /api/v1/plans/code/{code} | basic, premium, business |
| Moje objednavky | GET /api/v1/orders | Seznam objednavek |
| Vytvorit objednavku | POST /api/v1/orders | Nova objednavka |
| Simulace platby | POST /api/v1/orders/{id}/pay | Aktivuje hosting |

**Technologie:**
- Spring Boot 4.0.2
- Java 21
- JWT autentizace (jjwt 0.12.5)
- SLF4J logging
- Flyway migrace
- Swagger/OpenAPI dokumentace

**Entity (JPA):**
- [x] User
- [x] HostingPlan
- [x] Order
- [x] Domain
- [ ] FtpAccount
- [ ] CustomerDatabase
- [ ] EmailAccount
- [ ] Payment
- [ ] AuditLog

#### VOLITELNE (pro rozsireni)

**Autentizace:**
- [ ] Logout endpoint
- [ ] Refresh token
- [ ] Zmena hesla

**Sprava:**
- [ ] GET /api/v1/users - seznam uzivatelu (admin)
- [ ] GET /api/v1/domains - moje domeny
- [ ] GET /api/v1/ftp-accounts - moje FTP ucty
- [ ] GET /api/v1/databases - moje databaze

---

### 7. SMTP server (Mailpit) ✅

**Stav:** Hotovo (pro testovani)

| Polozka | Hodnota |
|---------|---------|
| Image | mailhog/mailhog |
| SMTP | localhost:1025 |
| Web UI | http://localhost:8025 |

**Poznamka:** Mailpit zachytava vsechny emaily a zobrazuje je ve webovem rozhrani. Zadne emaily neodchazeji ven - idealni pro vyvoj a testovani.

Pro produkci by bylo potreba nahradit skutecnym SMTP serverem (Postfix).

---

### 8. Dokumentace ✅

| Dokument | Popis |
|----------|-------|
| README.md | Prehled projektu |
| docs/JAK-PRACOVAT.md | Navod pro zacatecniky |
| docs/ZADANI-STAV.md | Tento dokument |
| docs/PRACE-S-DATABAZI.md | Flyway migrace, backup |
| docs/GETTING-STARTED.md | Kompletni navod |
| docs/UKOLY-BACKEND.md | Ukoly pro backend tym |
| docs/UKOLY-*.md | Ukoly pro jednotlive tymy |

---

## Licence

| Produkt | Licence | Soulad |
|---------|---------|--------|
| Apache HTTP Server | Apache License 2.0 | ✅ |
| Spring Boot | Apache License 2.0 | ✅ |
| MariaDB | GPL v2 | ✅ |
| Pure-FTPd | BSD | ✅ |
| Mailpit/Mailhog | MIT | ✅ |
| Docker | Apache License 2.0 | ✅ |

Vsechny pouzite produkty maji open-source licence kompatibilni se skolnim projektem.

---

## Co je potreba dodelat pro odevzdani

### SPLNENO ✅

- [x] **FTP server** - aktivovan, testovaci ucet pripraven
- [x] **Zakaznicke weby** - 3 ukazkove weby v customers/
- [x] **API endpointy** - GET /plans, POST /orders, POST /orders/{id}/pay
- [x] **JPA entity** - HostingPlan, Order, Domain
- [x] **Dokumentace** - kompletni v docs/

### Volitelne rozsireni

- [ ] **Admin rozhrani** - sprava uzivatelu a planu
- [ ] **Frontend** - jednoduche UI pro registraci/login
- [ ] **HTTPS** - SSL certifikaty
- [ ] **Dalsi entity** - FtpAccount, CustomerDatabase, Payment

---

## Architektura

```
                    ┌─────────────────────────────────────┐
                    │           DOCKER HOST               │
                    │                                     │
   Browser ────────▶│ ┌─────────┐     ┌──────────────┐   │
   :80              │ │ Apache  │────▶│ Spring Boot  │   │
                    │ │ (proxy) │     │   (API)      │   │
                    │ └────┬────┘     └──────┬───────┘   │
                    │      │                 │           │
                    │      │                 ▼           │
                    │      │          ┌──────────────┐   │
                    │      │          │   MariaDB    │   │
                    │      │          │              │   │
                    │      │          └──────────────┘   │
                    │      │                             │
                    │      ▼                             │
                    │ /srv/customers/                    │
                    │   ├── user_2/www/                  │
                    │   ├── user_3/www/                  │
                    │   └── user_4/www/                  │
                    │                                     │
   FTP ────────────▶│ ┌─────────┐                        │
   :21              │ │Pure-FTPd│───────────────────────▶│
                    │ └─────────┘                        │
                    │                                     │
   Email ──────────▶│ ┌─────────┐                        │
   :8025            │ │ Mailpit │                        │
                    │ └─────────┘                        │
                    └─────────────────────────────────────┘
```

---

## Odevzdani

1. Ujistit se, ze repozitar obsahuje:
   - [ ] Veskerou dokumentaci v docs/
   - [ ] Konfiguracni soubory (docker-compose.yml, apache-config/, ...)
   - [ ] .env.example (NE .env s hesly!)
   - [ ] README.md s navodem

2. Zpristupnit garantovi:
   - **Public repo:** Poslat URL na lukas.cegan@upce.cz
   - **Private repo:** Settings → Collaborators → pridat garanta

3. Pripravit na obhajobu:
   - [ ] Demo registrace a loginu
   - [ ] Demo FTP pristupu
   - [ ] Ukazka zakaznickeho webu
   - [ ] Vysvetleni architektury
