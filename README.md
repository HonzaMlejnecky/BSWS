# Hostingové centrum (MVP)

Semestrální projekt „Hostingové centrum“ ve virtuálním prostředí. Cílem je funkční end-to-end workflow:

**registrace → login → výběr plánu → vytvoření projektu → provisioning → FTP upload index.html → zobrazení webu na doméně**.

---

## 1) Scope projektu

Projekt implementuje minimální obhajitelné hostingové centrum:
- uživatelské účty (registrace/login bez email verifikace),
- výběr předplatného plánu,
- více projektů na uživatele,
- oddělené webrooty projektů,
- mapování domény na webroot přes Apache vhost,
- FTP údaje na detailu projektu,
- databáze MariaDB pro perzistenci.

### Co není součástí MVP
- komerční billing,
- komplexní mailhosting,
- IMAP/POP3/webmail,
- enterprise provisioning orchestrátor.

> **Email část:** v tomto MVP není plnohodnotně implementována. Projekt se soustředí na povinný hosting workflow.

---

## 2) Architektura

Hlavní entity:
- `User`
- `SubscriptionPlan (Plan)`
- `Subscription (User → Plan)`
- `Project` (včetně domény, webrootu, stavu, FTP údajů)

Vazby:
- jeden uživatel může mít více projektů,
- projekt patří právě jednomu uživateli,
- každý projekt má vlastní doménu a vlastní webroot,
- projekt vyžaduje aktivní subscription.

Stavy projektu:
- `provisioning`
- `active`
- `failed`

---

## 3) Spuštění projektu

## Požadavky
- Docker + Docker Compose
- Linux/macOS/WSL doporučeno

### Start
```bash
docker compose up -d --build
```

### Důležité endpointy
- Frontend: `http://localhost`
- Backend API: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui/index.html`

### Databáze
- host: `localhost`
- port: `3307`
- db: `hosting_platform`
- user: `platform_user`
- pass: `platformpass123`

Flyway migrace se aplikují při startu backendu automaticky.

---

## 4) Virtuální prostředí a `/etc/hosts`

Pro test domén přidejte do host souboru:

```txt
127.0.0.1 localhost api.local frontend.local
127.0.0.1 demo-1.local demo-2.local demo-3.local
```

Pokud aplikaci provozujete na jiné IP virtuálního serveru (např. `192.168.56.20`), použijte tuto IP místo `127.0.0.1`.

---

## 5) Uživatelský workflow

1. Registrace uživatele (`/register`) – bez email verifikace.
2. Login (`/login`).
3. Pokud uživatel nemá aktivní subscription, je přesměrován na `/plan`.
4. Po výběru plánu může vytvořit projekt (`/projects/new`).
5. Po vytvoření je uživatel přesměrován na detail projektu (`/projects/:id`).

---

## 6) Provisioning workflow

Při vytvoření projektu backend:
1. validuje unikátnost domény,
2. uloží projekt do DB ve stavu `provisioning`,
3. vytvoří webroot `customers/user_<id>/<project-slug>/www`,
4. připraví FTP přístupové údaje,
5. vytvoří Apache vhost konfiguraci pro doménu,
6. provede graceful reload Apache,
7. nastaví stav projektu na `active` (nebo `failed` při chybě).

---

## 7) FTP workflow

FTP údaje jsou v detailu projektu:
- FTP host
- FTP port
- FTP username
- FTP heslo
- webroot path

Postup:
1. Připojte se FTP klientem (např. FileZilla).
2. Nahrajte vlastní `index.html` do webrootu projektu.
3. Otevřete projektovou doménu v prohlížeči.

---

## 8) Infrastruktura

- Web server: Apache (`web/apache-config`)
- DB server: MariaDB (`db/init` + backend Flyway)
- FTP: přístupové údaje per projekt (MVP provisioning level)

Apache vhosty projektů se generují do adresáře definovaného backend konfigurací:
- `app.apache.vhosts-dir` (default `/srv/apache/vhosts.d`)

Mapování domény → webroot je řízeno `ServerName` a `DocumentRoot` ve vhostu.

---

## 9) Omezení

- Provisioning je synchronní (bez job queue).
- FTP účet je v MVP „prepared credentials“ model; navázání na externí FTP správce může vyžadovat další krok.
- Email SMTP/IMAP/POP3 stack není součástí tohoto MVP.

---

## 10) Akceptační scénáře (jak testovat)

1. Zaregistrovat nového uživatele.
2. Přihlásit se.
3. Vybrat plan.
4. Vytvořit projekt (název + doména).
5. Ověřit detail projektu + FTP údaje.
6. Uploadnout `index.html` do webrootu.
7. Otevřít doménu a ověřit obsah.
8. Vytvořit druhý projekt stejného uživatele.
9. Ověřit oddělení domén a obsahů.
10. Ověřit, že jiný uživatel nevidí cizí projekt (`/api/v1/projects/{id}` vrátí 404).
