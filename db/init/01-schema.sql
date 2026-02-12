-- ==============================================================================
-- HOSTING CENTRUM - Databazove schema
--
-- Tento soubor vytvari kompletni strukturu platformove databaze.
--
-- Architektura:
--   1. hosting_platform - systemova DB (tabulky nize)
--   2. cust_* - zakaznicke DB (vytvari backend dynamicky)
--
-- Reset DB: docker-compose down -v && docker-compose up -d --build
-- ==============================================================================

USE hosting_platform;

-- =============================================================================
-- USERS - Uzivatele systemu (zakaznici a admini)
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    username        VARCHAR(100) NOT NULL UNIQUE,
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

    INDEX idx_users_email (email),
    INDEX idx_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- HOSTING_PLANS - Tarify hostingu
-- =============================================================================
CREATE TABLE IF NOT EXISTS hosting_plans (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    code                VARCHAR(50) NOT NULL UNIQUE,
    name                VARCHAR(100) NOT NULL,
    description         TEXT,
    -- Limity
    disk_space_mb       INT NOT NULL DEFAULT 500,
    bandwidth_mb        INT NOT NULL DEFAULT 10000,
    max_domains         INT DEFAULT 1,
    max_databases       INT DEFAULT 1,
    max_ftp_accounts    INT DEFAULT 1,
    max_email_accounts  INT DEFAULT 5,
    -- Cena
    price_monthly       DECIMAL(10, 2) NOT NULL,
    price_yearly        DECIMAL(10, 2),
    -- Stav
    is_active           BOOLEAN DEFAULT TRUE,
    display_order       INT DEFAULT 0,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_plans_code (code),
    INDEX idx_plans_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- ORDERS - Objednavky hostingu
-- =============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    plan_id         BIGINT NOT NULL,
    order_number    VARCHAR(50) NOT NULL UNIQUE,
    -- Stav
    status          ENUM('pending', 'paid', 'active', 'suspended', 'cancelled', 'expired') DEFAULT 'pending',
    billing_cycle   ENUM('monthly', 'yearly') DEFAULT 'monthly',
    -- Casy
    started_at      TIMESTAMP NULL,
    expires_at      TIMESTAMP NULL,
    cancelled_at    TIMESTAMP NULL,
    -- Cena
    price_paid      DECIMAL(10, 2),
    -- Timestamps
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES hosting_plans(id),

    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_number (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- DOMAINS - Domeny zakazniku
-- =============================================================================
CREATE TABLE IF NOT EXISTS domains (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    domain_name     VARCHAR(255) NOT NULL UNIQUE,
    -- Nastaveni
    is_primary      BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    -- DNS (volitelne)
    dns_zone        TEXT,
    -- Timestamps
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,

    INDEX idx_domains_user (user_id),
    INDEX idx_domains_name (domain_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- FTP_ACCOUNTS - FTP ucty (Pure-FTPd cte primo z teto tabulky!)
-- =============================================================================
CREATE TABLE IF NOT EXISTS ftp_accounts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    -- FTP credentials
    ftp_username    VARCHAR(100) NOT NULL UNIQUE,
    ftp_password    VARCHAR(255) NOT NULL,          -- Pro Pure-FTPd: MD5 nebo cleartext
    -- Cesty a limity
    home_dir        VARCHAR(255) NOT NULL,          -- '/srv/customers/user_1'
    quota_mb        INT DEFAULT 500,
    -- Pro Pure-FTPd chroot
    uid             INT DEFAULT 1000,
    gid             INT DEFAULT 1000,
    -- Stav
    is_active       BOOLEAN DEFAULT TRUE,
    -- Timestamps
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at   TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,

    INDEX idx_ftp_user (user_id),
    INDEX idx_ftp_username (ftp_username),
    INDEX idx_ftp_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- CUSTOMER_DATABASES - Metadata o zakaznickych databazich
--
-- Tato tabulka NEOBSAHUJE data zakazniku, jen informace o jejich DB.
-- Skutecne zakaznicke DB jsou: cust_1, cust_2, ... (vytvari backend)
-- =============================================================================
CREATE TABLE IF NOT EXISTS customer_databases (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    -- DB credentials
    db_name         VARCHAR(64) NOT NULL UNIQUE,    -- 'cust_1_wordpress'
    db_user         VARCHAR(32) NOT NULL UNIQUE,    -- 'cust_1_wp'
    db_password     VARCHAR(255) NOT NULL,          -- Ulozene pro zobrazeni zakaznikovi
    -- Info
    description     VARCHAR(255),                   -- 'WordPress databaze'
    size_mb         INT DEFAULT 0,                  -- Aktualni velikost (aktualizuje cron)
    -- Stav
    is_active       BOOLEAN DEFAULT TRUE,
    -- Timestamps
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,

    INDEX idx_custdb_user (user_id),
    INDEX idx_custdb_name (db_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- EMAIL_ACCOUNTS - Emailove schranky
-- =============================================================================
CREATE TABLE IF NOT EXISTS email_accounts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    domain_id       BIGINT NOT NULL,
    -- Email credentials
    email_address   VARCHAR(255) NOT NULL UNIQUE,   -- 'info@mojefirma.cz'
    email_password  VARCHAR(255) NOT NULL,
    -- Limity
    quota_mb        INT DEFAULT 500,
    -- Stav
    is_active       BOOLEAN DEFAULT TRUE,
    -- Timestamps
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at   TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE,

    INDEX idx_email_user (user_id),
    INDEX idx_email_address (email_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- PAYMENTS - Platby (simulace)
-- =============================================================================
CREATE TABLE IF NOT EXISTS payments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    -- Platba
    payment_number  VARCHAR(50) NOT NULL UNIQUE,    -- 'PAY-2024-00001'
    amount          DECIMAL(10, 2) NOT NULL,
    currency        VARCHAR(3) DEFAULT 'CZK',
    -- Stav
    status          ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_method  ENUM('bank_transfer', 'card', 'simulation') DEFAULT 'simulation',
    -- Casy
    paid_at         TIMESTAMP NULL,
    -- Timestamps
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,

    INDEX idx_payments_user (user_id),
    INDEX idx_payments_order (order_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_number (payment_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- AUDIT_LOGS - Systemovy log (kdo co kdy udelal)
-- =============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT,                         -- NULL pro systemove akce
    -- Akce
    action          VARCHAR(100) NOT NULL,          -- 'user.login', 'order.create', 'ftp.created'
    entity_type     VARCHAR(50),                    -- 'user', 'order', 'domain'
    entity_id       BIGINT,                         -- ID entity
    -- Detaily
    ip_address      VARCHAR(45),                    -- IPv4 nebo IPv6
    user_agent      VARCHAR(500),
    details         JSON,                           -- Dalsi info jako JSON
    -- Timestamp
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- KONEC SCHEMATU
-- =============================================================================
