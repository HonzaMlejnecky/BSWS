# Jak začít - Kompletní návod pro tým

Tento dokument tě provede od nuly až po běžící projekt.

---

## 1. Co potřebuješ nainstalovat

### Povinné

| Software           | Odkaz                                                        | Poznámka                   |
| ------------------ | ------------------------------------------------------------ | -------------------------- |
| **Docker Desktop** | [docker.com/get-docker](https://docs.docker.com/get-docker/) | Windows/Mac - vše v jednom |
| **Git**            | [git-scm.com](https://git-scm.com/)                          | Verzování kódu             |

### Doporučené

| Software      | Odkaz                                                   | K čemu                                    |
| ------------- | ------------------------------------------------------- | ----------------------------------------- |
| **VS Code**   | [code.visualstudio.com](https://code.visualstudio.com/) | Editor kódu                               |
| **DBeaver**   | [dbeaver.io](https://dbeaver.io/)                       | GUI pro databázi (zdarma)                 |
| **TablePlus** | [tableplus.com](https://tableplus.com/)                 | GUI pro databázi (Mac, placené ale hezčí) |
| **Postman**   | [postman.com](https://www.postman.com/)                 | Testování API                             |
| **FileZilla** | [filezilla-project.org](https://filezilla-project.org/) | FTP klient                                |

---

## 2. Klonování projektu

```bash
# Otevři terminál a spusť:
git clone https://github.com/TVUJ-USERNAME/BSWS.git
cd BSWS
```

---

## 3. První spuštění

### Krok 1: Zkopíruj konfiguraci

```bash
cp .env.example .env
```

### Krok 2: Spusť Docker Desktop

- Windows/Mac: Otevři aplikaci Docker Desktop
- Počkej, až se spustí (ikona v systray přestane animovat)

### Krok 3: Spusť projekt

```bash
docker compose up -d --build
```

**Co to udělá:**

- Stáhne potřebné Docker images (poprvé ~5 minut)
- Sestaví Spring Boot aplikaci
- Spustí 3 kontejnery: databáze, backend, webserver

### Krok 4: Ověř, že vše běží

```bash
docker compose ps
```

Měl bys vidět:

```
NAME          STATUS
hc-db         Up (healthy)
hc-backend    Up (healthy)
hc-web        Up
```

### Krok 5: Otestuj v prohlížeči

- **http://localhost** - hlavní web (přes Apache)
- **http://localhost:8080** - backend API přímo

---

## 4. Konflikt portů?

Pokud dostaneš chybu `port already in use`:

### Zjisti, co běží na portu:

```bash
# Mac/Linux
lsof -i :80
lsof -i :8080
lsof -i :3307

# Windows (PowerShell)
netstat -ano | findstr :80
```

### Řešení A: Zastav konfliktní službu

```bash
# Např. zastavit lokální MySQL
brew services stop mysql          # Mac
sudo systemctl stop mysql         # Linux
net stop mysql                    # Windows
```

### Řešení B: Změň porty v .env, lepsi I guess :-)

```bash
# Uprav soubor .env:
WEB_PORT=8000        # místo 80
BACKEND_PORT=8081    # místo 8080
DB_PORT=3308         # místo 3307
```

Pak restartuj:

```bash
docker compose down
docker compose up -d
```

---

## 5. Práce s databází

### Přístupové údaje

| Parametr | Hodnota                     |
| -------- | --------------------------- |
| Host     | `localhost`                 |
| Port     | `3307` (nebo co máš v .env) |
| Databáze | `hosting_platform`          |
| Uživatel | `platform_user`             |
| Heslo    | `platformpass123`           |

### Možnost A: Příkazová řádka

```bash
# Připojit se do DB
docker exec -it hc-db mariadb -u platform_user -pplatformpass123 hosting_platform

# Příklady příkazů uvnitř:
SHOW TABLES;
SELECT * FROM users;
DESCRIBE users;
exit;
```

### Možnost B: DBeaver (GUI)

1. Otevři DBeaver
2. **Database → New Database Connection**
3. Vyber **MariaDB**
4. Vyplň:
   - Host: `localhost`
   - Port: `3307`
   - Database: `hosting_platform`
   - Username: `platform_user`
   - Password: `platformpass123`
5. **Test Connection** → mělo by být OK
6. **Finish**

### Možnost C: phpMyAdmin

Pokud chceš webové rozhraní, odkomentuj v `docker-compose.yml`:

```yaml
phpmyadmin:
  image: phpmyadmin:latest
  container_name: hc-phpmyadmin
  restart: unless-stopped
  depends_on:
    - db
  environment:
    PMA_HOST: db
    PMA_PORT: 3306
  ports:
    - "8081:80"
  networks:
    - hosting-net
```

Pak spusť:

```bash
docker compose up -d phpmyadmin
```

Otevři: **http://localhost:8081**

---

## 6. Práce s backendem (Spring Boot)

### Kde je kód

```
backend/
├── src/main/java/cz/upce/bsws/hostingcentrum/
│   ├── HostingCentrumApplication.java   ← Hlavní třída
│   ├── config/                          ← Konfigurace
│   ├── controller/                      ← REST endpointy
│   ├── service/                         ← Business logika
│   ├── repository/                      ← Databáze
│   └── model/                           ← Entity
└── src/main/resources/
    └── application.yml                  ← Konfigurace
```

### Jak upravit backend a vidět změny

**Varianta 1: Rebuild kontejneru (pomalejší)**

```bash
docker compose up -d --build backend
```

**Varianta 2: Lokální vývoj (rychlejší)**

1. Nainstaluj Java 21 a Maven
2. Spusť backend lokálně:

```bash
cd backend
mvn spring-boot:run
```

### Logy backendu

```bash
# Sledovat logy v reálném čase
docker compose logs -f backend

# Posledních 100 řádků
docker compose logs --tail=100 backend
```

### Test API

```bash
# Hlavní endpoint
curl http://localhost:8080/

# Status endpoint
curl http://localhost:8080/api/status
```

---

## 7. Práce s frontendem

### ZATÍM PRÁZDNÉ - čeká na tým Frontend

Jakmile Frontend tým inicializuje projekt:

```bash
cd frontend

# Instalace závislostí
npm install

# Spuštění dev serveru
npm run dev
```

Pak otevři: **http://localhost:5173** (nebo jiný port podle frameworku)

---

## 8. Testování zákaznických webů

### Přidej domény do hosts souboru

**Mac/Linux:**

```bash
sudo nano /etc/hosts
```

**Windows (jako Admin):**

```
notepad C:\Windows\System32\drivers\etc\hosts
```

Přidej řádky:

```
127.0.0.1   www.mojefirma.cz mojefirma.cz
127.0.0.1   www.druhafirma.cz druhafirma.cz
127.0.0.1   www.tretifirma.cz tretifirma.cz
```

### Otestuj

- http://www.mojefirma.cz
- http://www.druhafirma.cz
- http://www.tretifirma.cz

---

## 9. Nejčastější příkazy

### Spuštění a zastavení

```bash
# Spustit vše
docker compose up -d

# Spustit vše a přebuildit
docker compose up -d --build

# Zastavit vše
docker compose down

# Zastavit vše a SMAZAT DATA (reset DB)
docker compose down -v
```

### Sledování logů

```bash
# Všechny logy
docker compose logs -f

# Logy konkrétní služby
docker compose logs -f backend
docker compose logs -f web
docker compose logs -f db
```

### Restart služby

```bash
# Restart backendu
docker compose restart backend

# Restart webserveru (po změně Apache config)
docker compose restart web
```

### Stav kontejnerů

```bash
# Přehled běžících kontejnerů
docker compose ps

# Detailní info o kontejneru
docker inspect hc-backend
```

### Shell do kontejneru

```bash
# Backend (Alpine Linux)
docker exec -it hc-backend sh

# Databáze
docker exec -it hc-db bash

# Webserver
docker exec -it hc-web sh
```

### Databázové příkazy

```bash
# Připojit k databázi
docker exec -it hc-db mariadb -u platform_user -pplatformpass123 hosting_platform

# Spustit SQL soubor
docker exec -i hc-db mariadb -u platform_user -pplatformpass123 hosting_platform < muj_skript.sql

# Export databáze
docker exec hc-db mariadb-dump -u root -prootpass123 hosting_platform > backup.sql
```

---

## 10. Troubleshooting

### Kontejner se nespustí

```bash
# Podívej se na logy
docker compose logs backend

# Zkontroluj, jestli něco neblokuje port
docker compose down
lsof -i :8080
```

### Backend hlásí "Cannot connect to database"

```bash
# Ověř, že DB běží
docker compose ps

# Restartuj DB
docker compose restart db

# Počkej 30 sekund, pak restartuj backend
docker compose restart backend
```

### Změny v kódu se neprojevují

```bash
# Pro backend - rebuild
docker compose up -d --build backend

# Pro Apache config
docker compose restart web

# Pro SQL skripty - reset DB
docker compose down -v
docker compose up -d --build
```

### "Permission denied" na Macu

```bash
# Oprávnění pro Docker
sudo chmod 666 /var/run/docker.sock
```

### Docker zabírá moc místa

```bash
# Smaž nepoužívané images a kontejnery
docker system prune -a

# Smaž i volumes (POZOR - smaže data!)
docker system prune -a --volumes
```

---

## 11. Struktura projektu

```
BSWS/
├── docker-compose.yml      # Orchestrace kontejnerů
├── .env.example            # Šablona konfigurace
├── .env                    # Tvoje lokální konfigurace (NENÍ v gitu!)
│
├── backend/                # Spring Boot aplikace
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│
├── frontend/               # React/Next.js (čeká na tým)
│
├── web/                    # Apache HTTP Server
│   └── apache-config/
│       ├── httpd.conf
│       └── vhosts.conf
│
├── db/                     # MariaDB
│   └── init/               # SQL skripty (spustí se při prvním startu)
│
├── ftp/                    # FTP server (zatím vypnutý)
├── mail/                   # Mail server (zatím vypnutý)
│
├── customers/              # Zákaznické weby
│   ├── user_2/www/
│   ├── user_3/www/
│   └── user_4/www/
│
└── docs/                   # Dokumentace
    ├── GETTING-STARTED.md  # Tento soubor
    ├── ROZDELENI-PRACE.md  # Kdo co dělá
    └── UKOLY-*.md          # Úkoly pro jednotlivé týmy
```

---

## 12. Git workflow

### Před začátkem práce

```bash
# Stáhni nejnovější změny
git pull origin main
```

### Vytvoření feature branch

```bash
# Vytvoř novou branch
git checkout -b feature/moje-zmena

# Pracuj, commituj...
git add .
git commit -m "feat: popis změny"

# Pushni branch
git push -u origin feature/moje-zmena
```

### Vytvoření Pull Request

1. Jdi na GitHub
2. Klikni na "Compare & pull request"
3. Vyplň popis
4. Požádej o review
5. nah, tohle je zbytecny, proste si udelejte PR a sami si to mergnete, zaroven si reste konflikty sami atd atd. vsak to znate, jen me zajimlao kdo to sem docetl :D

---

## Potřebuješ pomoct?

1. Podívej se do `docs/UKOLY-*.md` pro svůj tým
2. Zeptej se Team Leadera
3. Napiš do týmového chatu
