# Ukoly: FTP Server (Pure-FTPd)

**Slozka:** `ftp/`
**Zodpovednost:** 1 osoba (spolecne s Mail)

## Co uz je pripraveno

- Sekce `ftp` v `docker-compose.yml` (ZAKOMENTOVANA)
- Slozky pro zakaznicke weby v `customers/`

## Doporucene reseni

**Pure-FTPd s MySQL autentizaci**

Proc:
- Uzivatele se autentizuji primo z databaze
- Chroot izolace - kazdy vidi pouze svou slozku
- Dobre Docker image (`stilliard/pure-ftpd`)

## Ukoly

### 1. Odkomentovat v docker-compose.yml

```yaml
ftp:
  image: stilliard/pure-ftpd:latest
  container_name: hc-ftp
  restart: unless-stopped
  depends_on:
    db:
      condition: service_healthy
  environment:
    PUBLICHOST: "localhost"
    FTP_PASSIVE_PORTS: "30000:30009"
  volumes:
    - ./customers:/srv/customers
    - ./ftp/pureftpd-mysql.conf:/etc/pure-ftpd/db/mysql.conf:ro
  ports:
    - "21:21"
    - "30000-30009:30000-30009"
  networks:
    - hosting-net
```

### 2. Vytvorit MySQL konfiguraci

Vytvor `ftp/pureftpd-mysql.conf`:

```
MYSQLSocket     /var/run/mysqld/mysqld.sock
# Nebo pro TCP:
MYSQLServer     db
MYSQLPort       3306
MYSQLUser       platform_user
MYSQLPassword   platformpass123
MYSQLDatabase   hosting_platform

# SQL dotaz pro autentizaci
MYSQLGetPW      SELECT ftp_password FROM ftp_accounts WHERE ftp_username="\L" AND is_active=1
MYSQLGetUID     SELECT uid FROM ftp_accounts WHERE ftp_username="\L" AND is_active=1
MYSQLGetGID     SELECT gid FROM ftp_accounts WHERE ftp_username="\L" AND is_active=1
MYSQLGetDir     SELECT home_dir FROM ftp_accounts WHERE ftp_username="\L" AND is_active=1

# Kvota (volitelne)
# MYSQLGetQTAFS   SELECT quota_mb FROM ftp_accounts WHERE ftp_username="\L"
```

**Poznamka:** `\L` = login name (username)

### 3. Pripravit databazovou tabulku

Tabulka `ftp_accounts` musi existovat (TYM DATABAZE):

```sql
CREATE TABLE ftp_accounts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    ftp_username    VARCHAR(100) NOT NULL UNIQUE,
    ftp_password    VARCHAR(255) NOT NULL,    -- MD5 hash!
    home_dir        VARCHAR(255) NOT NULL,    -- '/srv/customers/user_1'
    quota_mb        INT DEFAULT 500,
    uid             INT DEFAULT 1000,
    gid             INT DEFAULT 1000,
    is_active       BOOLEAN DEFAULT TRUE
);

-- Testovaci ucet (heslo: ftppass123)
INSERT INTO ftp_accounts (user_id, ftp_username, ftp_password, home_dir)
VALUES (2, 'mojefirma_ftp', MD5('ftppass123'), '/srv/customers/user_2');
```

**DULEZITE:** Heslo musi byt MD5 hash!
```sql
SELECT MD5('ftppass123');  -- = '5d41402abc4b2a76b9719d911017c592' (priklad)
```

### 4. Vytvorit slozky zakazniku

Struktura:
```
customers/
├── user_2/
│   └── www/
│       └── index.html
├── user_3/
│   └── www/
└── user_4/
    └── www/
```

Backend vytvori slozku pri aktivaci hostingu:
```java
Files.createDirectories(Paths.get("/srv/customers/user_" + userId + "/www"));
```

### 5. Nastavit prava

FTP server bezi pod UID/GID 1000. Slozky musi byt zapisovatelne:

```bash
# V Docker kontejneru nebo pres volume
chown -R 1000:1000 /srv/customers
chmod -R 755 /srv/customers
```

### 6. Testovani

```bash
# Spustit FTP
docker-compose up -d ftp

# Test z prikazove radky
ftp localhost
# Username: mojefirma_ftp
# Password: ftppass123

# Test s FileZilla
# Host: localhost
# Port: 21
# Username: mojefirma_ftp
# Password: ftppass123
```

### 7. Troubleshooting

```bash
# Logy FTP serveru
docker-compose logs -f ftp

# Shell do kontejneru
docker exec -it hc-ftp bash

# Test MySQL spojeni z FTP kontejneru
mysql -h db -u platform_user -p hosting_platform
```

## Alternativa: SFTP

Pokud preferujes SFTP (bezpecnejsi, pres SSH):

```yaml
sftp:
  image: atmoz/sftp
  container_name: hc-sftp
  volumes:
    - ./customers:/home
    - ./ftp/users.conf:/etc/sftp/users.conf:ro
  ports:
    - "2222:22"
  networks:
    - hosting-net
```

`ftp/users.conf`:
```
mojefirma:ftppass123:1000:1000:www
druhafirma:ftppass123:1000:1000:www
```

**Nevyhoda:** Nema nativni MySQL auth, uzivatele se definuji v souboru.

## Checklist

- [ ] Odkomentovat FTP v docker-compose.yml
- [ ] Vytvorit `pureftpd-mysql.conf`
- [ ] Overit, ze tabulka `ftp_accounts` existuje
- [ ] Pridat testovaci FTP ucet do DB
- [ ] Vytvorit slozky zakazniku
- [ ] Nastavit prava (UID/GID 1000)
- [ ] Otestovat pripojeni (ftp localhost)
- [ ] Otestovat s FileZilla
- [ ] Dokumentovat pro zakazniky
