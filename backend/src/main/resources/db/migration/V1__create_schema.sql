-- ==============================================================================
-- HOSTING CENTRUM - Database Schema
-- Flyway Migration V1
--
-- Architecture:
--   1. hosting_platform - system DB (tables below)
--   2. cust_* - customer DBs (created dynamically by backend)
-- ==============================================================================

-- =============================================================================
-- USERS - System users (customers and admins)
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
    -- Address
    street          VARCHAR(255),
    city            VARCHAR(100),
    postal_code     VARCHAR(20),
    country         VARCHAR(100) DEFAULT 'CZ',
    -- Status
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
-- HOSTING_PLANS - Hosting pricing tiers
-- =============================================================================
CREATE TABLE IF NOT EXISTS hosting_plans (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    code                VARCHAR(50) NOT NULL UNIQUE,
    name                VARCHAR(100) NOT NULL,
    description         TEXT,
    -- Limits
    disk_space_mb       INT NOT NULL DEFAULT 500,
    bandwidth_mb        INT NOT NULL DEFAULT 10000,
    max_domains         INT DEFAULT 1,
    max_databases       INT DEFAULT 1,
    max_ftp_accounts    INT DEFAULT 1,
    max_email_accounts  INT DEFAULT 5,
    -- Pricing
    price_monthly       DECIMAL(10, 2) NOT NULL,
    price_yearly        DECIMAL(10, 2),
    -- Status
    is_active           BOOLEAN DEFAULT TRUE,
    display_order       INT DEFAULT 0,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_plans_code (code),
    INDEX idx_plans_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- ORDERS - Hosting orders
-- =============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    plan_id         BIGINT NOT NULL,
    order_number    VARCHAR(50) NOT NULL UNIQUE,
    -- Status
    status          ENUM('pending', 'paid', 'active', 'suspended', 'cancelled', 'expired') DEFAULT 'pending',
    billing_cycle   ENUM('monthly', 'yearly') DEFAULT 'monthly',
    -- Dates
    started_at      TIMESTAMP NULL,
    expires_at      TIMESTAMP NULL,
    cancelled_at    TIMESTAMP NULL,
    -- Price
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
-- DOMAINS - Customer domains
-- =============================================================================
CREATE TABLE IF NOT EXISTS domains (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    domain_name     VARCHAR(255) NOT NULL UNIQUE,
    -- Settings
    is_primary      BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    -- DNS (optional)
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
-- FTP_ACCOUNTS - FTP accounts (Pure-FTPd reads directly from this table!)
-- =============================================================================
CREATE TABLE IF NOT EXISTS ftp_accounts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    -- FTP credentials
    ftp_username    VARCHAR(100) NOT NULL UNIQUE,
    ftp_password    VARCHAR(255) NOT NULL,          -- For Pure-FTPd: MD5 or cleartext
    -- Paths and limits
    home_dir        VARCHAR(255) NOT NULL,          -- '/srv/customers/user_1'
    quota_mb        INT DEFAULT 500,
    -- For Pure-FTPd chroot
    uid             INT DEFAULT 1000,
    gid             INT DEFAULT 1000,
    -- Status
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
-- CUSTOMER_DATABASES - Customer database metadata
--
-- This table does NOT contain customer data, only information about their DBs.
-- Actual customer DBs are: cust_1, cust_2, ... (created by backend)
-- =============================================================================
CREATE TABLE IF NOT EXISTS customer_databases (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    -- DB credentials
    db_name         VARCHAR(64) NOT NULL UNIQUE,    -- 'cust_1_wordpress'
    db_user         VARCHAR(32) NOT NULL UNIQUE,    -- 'cust_1_wp'
    db_password     VARCHAR(255) NOT NULL,          -- Stored for customer display
    -- Info
    description     VARCHAR(255),                   -- 'WordPress database'
    size_mb         INT DEFAULT 0,                  -- Current size (updated by cron)
    -- Status
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
-- EMAIL_ACCOUNTS - Email mailboxes
-- =============================================================================
CREATE TABLE IF NOT EXISTS email_accounts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    domain_id       BIGINT NOT NULL,
    -- Email credentials
    email_address   VARCHAR(255) NOT NULL UNIQUE,   -- 'info@example.com'
    email_password  VARCHAR(255) NOT NULL,
    -- Limits
    quota_mb        INT DEFAULT 500,
    -- Status
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
-- PAYMENTS - Payments (simulation)
-- =============================================================================
CREATE TABLE IF NOT EXISTS payments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    -- Payment
    payment_number  VARCHAR(50) NOT NULL UNIQUE,    -- 'PAY-2024-00001'
    amount          DECIMAL(10, 2) NOT NULL,
    currency        VARCHAR(3) DEFAULT 'CZK',
    -- Status
    status          ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_method  ENUM('bank_transfer', 'card', 'simulation') DEFAULT 'simulation',
    -- Dates
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
-- AUDIT_LOGS - System audit log (who did what when)
-- =============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT,                         -- NULL for system actions
    -- Action
    action          VARCHAR(100) NOT NULL,          -- 'user.login', 'order.create', 'ftp.created'
    entity_type     VARCHAR(50),                    -- 'user', 'order', 'domain'
    entity_id       BIGINT,                         -- Entity ID
    -- Details
    ip_address      VARCHAR(45),                    -- IPv4 or IPv6
    user_agent      VARCHAR(500),
    details         JSON,                           -- Additional info as JSON
    -- Timestamp
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
