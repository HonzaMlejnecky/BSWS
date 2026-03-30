# Hostingové centrum

Semestrální projekt „Hostingové centrum“ ve virtuálním prostředí. Systém pokrývá kompletní workflow:

**registrace → login → výběr plánu → vytvoření projektu → provisioning → upload obsahu (FTP nebo přes aplikaci) → publikace webu na doméně**.

---

## 1) Scope projektu

Projekt implementuje funkční hostingové centrum pro statické weby:
- uživatelské účty (registrace/login),
- výběr a aktivace hostingového plánu,
- více projektů na uživatele,
- oddělené webrooty projektů,
- mapování domény na webroot přes Apache VirtualHost,
- FTP přístupové údaje na detailu projektu,
- přímý upload souborů přes aplikaci,
- databáze MariaDB pro perzistenci.

Mimo scope zůstává komerční billing engine a plnohodnotný mailhosting stack.

---

## 2) Hostingové plány

Aplikace pracuje se třemi aktivními plány:
- **Basic** – 1 projekt, základní publikace, FTP přístup,
- **Standard** – více projektů, vyšší limity, FTP + upload přes aplikaci,
- **Premium** – nejvyšší limity, rozšířené parametry pro náročnější weby.

Plán je uložen do subscription a při vytváření projektu se propisuje do metadat projektu.

---

## 3) Architektura

Hlavní entity:
- `User`
- `Plan`
- `Subscription`
- `Project` (doména, webroot, stav, FTP údaje)

Stavy projektu:
- `provisioning`
- `active`
- `failed`

Každý projekt má vlastní webroot a samostatnou doménu.

---

## 4) Spuštění projektu

### Požadavky
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

---

## 5) Apache provisioning workflow

Backend při vytvoření projektu:
1. vytvoří webroot v `/srv/customers/user_<id>/<slug>/www`,
2. vytvoří/aktualizuje Apache vhost v adresáři `/srv/apache/vhosts.d`,
3. provede validační a reload command (konfigurovatelné přes env),
4. nastaví stav projektu na `active`.

Apache načítá zákaznické vhosty přes:
```apache
IncludeOptional conf/extra/vhosts.d/*.conf
```

V Docker Compose je složka vhostů sdílená mezi `backend` a `web` službou přes bind mount `./web/apache-config/vhosts.d`.

---

## 6) Upload obsahu

Projekt podporuje dvě cesty:
1. **FTP upload** do webrootu projektu,
2. **Upload přes aplikaci** na detailu projektu (`/projects/:id`).

Přímý upload validuje název souboru a ukládá pouze do webrootu konkrétního projektu.

---

## 7) Veřejná část aplikace

Landing page je dostupná na `/` a obsahuje:
- představení služby,
- přehled plánů,
- CTA na registraci a přihlášení.

Po přihlášení uživatel pracuje v interní části (dashboard, projektový detail, plán).

---

## 8) Ověřovací scénář

1. Otevřít veřejnou landing page.
2. Registrovat uživatele.
3. Přihlásit se.
4. Vybrat jeden ze 3 plánů.
5. Vytvořit projekt.
6. Ověřit, že provisioning vytvořil webroot i vhost config.
7. Nahrát `index.html` přes FTP.
8. Nahrát `index.html` přes aplikaci.
9. Ověřit publikovaný obsah na doméně.
10. Vytvořit další projekt a ověřit oddělení dat.
