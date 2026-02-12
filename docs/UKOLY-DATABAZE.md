# Ukoly: Databaze (MariaDB)

**Slozka:** `db/`
**Zodpovednost:** 1 osoba

## Co uz je pripraveno

- MariaDB 11 kontejner v `docker-compose.yml`
- Ukazkovy init skript `db/init/01-schema.sql`
- Pristup: `localhost:3306`, user `platform_user` / `platformpass123`

## Struktura slozky

```
db/
└── init/
    ├── 01-schema.sql       ← Hlavni schema (tabulky, indexy)
    ├── 02-seed.sql         ← Testovaci data
    └── 03-procedures.sql   ← Stored procedures (volitelne)
```

**POZOR:** Skripty se spousti ABECEDNE pri prvnim startu kontejneru!

## Ukoly

### 1. Platformova databaze - Schema

Vytvor kompletni schema pro tyto tabulky:

#### users
```sql
CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    username        VARCHAR(100) NOT NULL,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    phone           VARCHAR(20),
    company_name    VARCHAR(255),
    -- Adresa
    street          VARCHAR(255),
    city            VARCHAR(100),
    postal_code     VARCHAR(20),
    country         VARCHAR(100) DEFAULT 'CZ',
    -- Stav
    role            ENUM('customer', 'admin') DEFAULT 'customer',
    is_active       BOOLEAN DEFAULT TRUE,
    is_verified     BOOLEAN DEFAULT FALSE,
    -- Timestamps
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at   TIMESTAMP NULL,

    INDEX idx_users_email (email)
);
```

#### hosting_plans
```sql
CREATE TABLE hosting_plans (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    code            VARCHAR(50) NOT NULL UNIQUE,     -- 'basic', 'premium', 'business'
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    disk_space_mb   INT NOT NULL DEFAULT 500,
    max_domains     INT DEFAULT 1,
    max_databases   INT DEFAULT 1,
    max_ftp_accounts INT DEFAULT 1,
    max_email_accounts INT DEFAULT 5,
    price_monthly   DECIMAL(10, 2) NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    display_order   INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### orders
```sql
CREATE TABLE orders (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    plan_id         BIGINT NOT NULL,
    order_number    VARCHAR(50) NOT NULL UNIQUE,     -- 'ORD-2024-00001'
    status          ENUM('pending', 'paid', 'active', 'suspended', 'cancelled') DEFAULT 'pending',
    billing_cycle   ENUM('monthly', 'yearly') DEFAULT 'monthly',
    started_at      TIMESTAMP NULL,
    expires_at      TIMESTAMP NULL,
    price_paid      DECIMAL(10, 2),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES hosting_plans(id)
);
```

#### domains
```sql
CREATE TABLE domains (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    domain_name     VARCHAR(255) NOT NULL UNIQUE,
    is_primary      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

#### ftp_accounts
**DULEZITE:** Pure-FTPd cte uzivatele PRIMO z teto tabulky!

```sql
CREATE TABLE ftp_accounts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    ftp_username    VARCHAR(100) NOT NULL UNIQUE,
    ftp_password    VARCHAR(255) NOT NULL,           -- MD5 hash pro Pure-FTPd!
    home_dir        VARCHAR(255) NOT NULL,           -- '/srv/customers/user_1'
    quota_mb        INT DEFAULT 500,
    uid             INT DEFAULT 1000,                -- Pro chroot
    gid             INT DEFAULT 1000,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

#### customer_databases
```sql
CREATE TABLE customer_databases (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    db_name         VARCHAR(64) NOT NULL UNIQUE,
    db_user         VARCHAR(32) NOT NULL UNIQUE,
    db_password     VARCHAR(255) NOT NULL,           -- Plain text (zobrazime zakaznikovi)
    description     VARCHAR(255),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

#### email_accounts
```sql
CREATE TABLE email_accounts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    email_address   VARCHAR(255) NOT NULL UNIQUE,
    email_password  VARCHAR(255) NOT NULL,
    quota_mb        INT DEFAULT 500,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

#### payments
```sql
CREATE TABLE payments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    payment_number  VARCHAR(50) NOT NULL UNIQUE,
    amount          DECIMAL(10, 2) NOT NULL,
    status          ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_method  ENUM('bank_transfer', 'card', 'simulation') DEFAULT 'simulation',
    paid_at         TIMESTAMP NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

#### audit_logs
```sql
CREATE TABLE audit_logs (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT,
    action          VARCHAR(100) NOT NULL,           -- 'user.login', 'order.create'
    entity_type     VARCHAR(50),
    entity_id       BIGINT,
    ip_address      VARCHAR(45),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_action (action),
    INDEX idx_audit_created (created_at)
);
```

### 2. Testovaci data

Vytvor `02-seed.sql` s testovacimi daty:

- [ ] Min. 3 hostingove plany (Basic, Premium, Business)
- [ ] Admin ucet (heslo: admin123)
- [ ] Min. 5 testovacich zakazniku
- [ ] Objednavky, domeny, FTP ucty

**Hesla:**
- Pro Spring Boot (bcrypt): `$2a$12$...`
- Pro Pure-FTPd (MD5): `MD5('heslo')`

### 3. Zakaznicke databaze

Backend bude vytvaret zakaznicke DB dynamicky. Dokumentuj postup:

```sql
-- Backend provede:
CREATE DATABASE cust_1_wordpress;
CREATE USER 'cust_1_wp'@'%' IDENTIFIED BY 'random_password';
GRANT ALL PRIVILEGES ON cust_1_wordpress.* TO 'cust_1_wp'@'%';
FLUSH PRIVILEGES;
```

### 4. Prava uzivatele

`platform_user` by mel mit omezena prava:
- SELECT, INSERT, UPDATE, DELETE na tabulky
- ALE: pro vytvareni zakaznickych DB potrebuje `CREATE`, `CREATE USER`, `GRANT`

Moznosti:
- Pouzit root pro dynamicke operace
- Nebo pridat prava: `GRANT CREATE, CREATE USER ON *.* TO 'platform_user'@'%';`

## Prikazy

```bash
# Pripojit k DB
docker exec -it hc-db mysql -u platform_user -p hosting_platform

# Reset DB (smaze data!)
docker-compose down -v && docker-compose up -d --build

# Exportovat schema
docker exec hc-db mysqldump -u root -p --no-data hosting_platform > schema.sql
```

## Checklist

- [ ] Tabulka users
- [ ] Tabulka hosting_plans
- [ ] Tabulka orders
- [ ] Tabulka domains
- [ ] Tabulka ftp_accounts (pro Pure-FTPd)
- [ ] Tabulka customer_databases
- [ ] Tabulka email_accounts
- [ ] Tabulka payments
- [ ] Tabulka audit_logs
- [ ] Indexy na casto hledane sloupce
- [ ] Foreign keys s ON DELETE
- [ ] Testovaci data (min. 5 uzivatelu)
- [ ] Dokumentace pro backend (jak vytvorit zakaznickou DB)
