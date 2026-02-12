# Rozdeleni prace - 8 lidi

## Prehled roli

| Role | Pocet | Slozka | Dokumentace |
|------|-------|--------|-------------|
| Team Leader | 1 | - | - |
| Backend | 2 | `backend/` | `UKOLY-BACKEND.md` |
| Frontend | 2 | `frontend/` | `UKOLY-FRONTEND.md` |
| Databaze | 1 | `db/` | `UKOLY-DATABAZE.md` |
| Webserver | 1 | `web/` | `UKOLY-WEBSERVER.md` |
| FTP + Mail | 1 | `ftp/`, `mail/` | `UKOLY-FTP.md`, `UKOLY-MAIL.md` |

---

## 1. Team Leader (1 osoba)

**Zodpovednost:**
- Koordinace tymu, code review, merge PR
- Komunikace s garantem predmetu
- Sledovani progresu, reseni blokeru
- Finalni testovani a dokumentace

**Ukoly:**
- [ ] Vytvorit GitHub repozitar a pridat cleny tymu
- [ ] Nastavit branch protection (vyzadovat PR review)
- [ ] Sledovat progress pres GitHub Projects / Issues
- [ ] Code review vsech PR pred mergem
- [ ] Pripravit prezentaci / dokumentaci

---

## 2. Backend (2 osoby)

**Slozka:** `backend/`
**Dokumentace:** `docs/UKOLY-BACKEND.md`

**Rozdeleni mezi 2 lidi:**

### Backend A - Autentizace & Uzivatele
- [ ] Entity: User, Role
- [ ] Registrace, login, logout (JWT nebo sessions)
- [ ] Sprava uzivatelskeho profilu
- [ ] Zmena hesla, reset hesla (email)
- [ ] Admin endpointy (seznam uzivatelu)

### Backend B - Hosting & Objednavky
- [ ] Entity: HostingPlan, Order, Domain
- [ ] CRUD pro hostingove plany
- [ ] Vytvareni objednavek, zmena stavu
- [ ] Sprava domen
- [ ] Simulace platby
- [ ] Vytvareni zakaznickych DB (CREATE DATABASE, CREATE USER)
- [ ] Vytvareni FTP uctu (INSERT do tabulky ftp_accounts)

---

## 3. Frontend (2 osoby)

**Slozka:** `frontend/`
**Dokumentace:** `docs/UKOLY-FRONTEND.md`

**Rozdeleni mezi 2 lidi:**

### Frontend A - Verejne stranky
- [ ] Inicializace projektu (React/Next.js)
- [ ] Homepage, stranky s tarify
- [ ] Registrace, login formulare
- [ ] Responzivni design, stylování

### Frontend B - Dashboard
- [ ] Zakaznicky dashboard (po prihlaseni)
- [ ] Prehled objednavek, domen
- [ ] FTP pristupove udaje
- [ ] Databazove pripojeni
- [ ] Formular pro upload souboru (volitelne)
- [ ] Admin panel (volitelne)

---

## 4. Databaze (1 osoba)

**Slozka:** `db/`
**Dokumentace:** `docs/UKOLY-DATABAZE.md`

**Ukoly:**
- [ ] Navrh kompletniho schematu platformove DB
- [ ] Tabulky: users, hosting_plans, orders, domains, ftp_accounts, customer_databases, email_accounts, payments, audit_logs
- [ ] Relace, indexy, constraints
- [ ] Testovaci data (min. 5 uzivatelu, objednavky, domeny)
- [ ] Mechanismus pro zakaznicke DB (dokumentace pro backend)
- [ ] Optimalizace dotazu (indexy)

---

## 5. Webserver (1 osoba)

**Slozka:** `web/`
**Dokumentace:** `docs/UKOLY-WEBSERVER.md`

**Ukoly:**
- [ ] Konfigurace Apache jako reverse proxy
- [ ] VirtualHosty pro testovaci domeny (min. 3)
- [ ] Servirovani zakaznickych webu z `/srv/customers/{user}/www`
- [ ] Bezpecnostni hlavicky (X-Frame-Options, CSP, ...)
- [ ] Logování pristupu
- [ ] (Volitelne) SSL/TLS konfigurace

---

## 6. FTP + Mail (1 osoba)

**Slozka:** `ftp/`, `mail/`
**Dokumentace:** `docs/UKOLY-FTP.md`, `docs/UKOLY-MAIL.md`

**Ukoly FTP:**
- [ ] Konfigurace Pure-FTPd s MySQL autentizaci
- [ ] Chroot izolace - uzivatel vidi pouze svou slozku
- [ ] Testovani s FileZilla
- [ ] Dokumentace pro zakazniky

**Ukoly Mail:**
- [ ] Aktivace Mailpit kontejneru
- [ ] Napojeni na backend (nodemailer/JavaMail)
- [ ] Testovani odesilani emailu
- [ ] (Volitelne) Postfix pro realne odesilani

---

## Zavislosti a poradi prace

```
       TYDEN 1                    TYDEN 2                    TYDEN 3
    +-------------+           +-------------+           +-------------+
    | Setup       |           | Backend API |           | Integrace   |
    | - Docker OK |     →     | - Auth      |     →     | - FTP       |
    | - DB schema |           | - Orders    |           | - Mail      |
    | - Apache OK |           | - Frontend  |           | - Testovani |
    +-------------+           +-------------+           +-------------+
```

### Co na cem zavisi:

1. **Nezavisle (muze zacat hned):**
   - Databaze: schema
   - Webserver: Apache konfigurace
   - Frontend: setup projektu, staticke stranky

2. **Zavisi na databazi:**
   - Backend: potrebuje hotove schema
   - FTP: potrebuje tabulku ftp_accounts

3. **Zavisi na backendu:**
   - Frontend: napojeni na API
   - Mail: odesilani emailu z backendu

---

## Git workflow

### Branches
- `main` - produkcni kod, pouze pres PR
- `develop` - integracni branch (volitelne)
- `feature/backend-auth` - feature branch
- `feature/frontend-dashboard` - feature branch
- `fix/ftp-permissions` - bugfix branch

### Commit zpravy
```
feat(backend): add user registration endpoint
fix(frontend): fix login form validation
docs(db): add database schema documentation
chore(docker): update compose file
```

### Pull Request proces
1. Vytvor branch z `main`
2. Implementuj feature
3. Push branch, vytvor PR
4. Pozadej o review (Team Leader nebo kolega)
5. Po schvaleni merge do `main`

---

## Komunikace

- **GitHub Issues** - pro ukoly a bugy
- **GitHub Projects** - Kanban board (To Do, In Progress, Done)
- **Discord/Slack** - rychla komunikace
- **Pravidelne schuzky** - 1-2x tydne synchronizace
