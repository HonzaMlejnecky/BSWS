-- ==============================================================================
-- HOSTING CENTRUM - Database Schema
-- Flyway Migration V1
-- ==============================================================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    username        VARCHAR(100) UNIQUE,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    phone           VARCHAR(20),
    street          VARCHAR(255),
    city            VARCHAR(100),
    postal_code     VARCHAR(20),
    country         VARCHAR(100) DEFAULT 'CZ',
    role            ENUM('customer', 'admin') DEFAULT 'customer',
    is_active       BOOLEAN DEFAULT TRUE,
    code            VARCHAR(255),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at   TIMESTAMP NULL,
    INDEX idx_users_email (email),
    INDEX idx_users_username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- HOSTING_PLANS
CREATE TABLE IF NOT EXISTS plans (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    code                VARCHAR(50) NOT NULL UNIQUE,
    name                VARCHAR(100) NOT NULL,
    description         TEXT,
    disk_space_mb       INT NOT NULL DEFAULT 500,
    max_projects        INT DEFAULT 1,
    max_databases       INT DEFAULT 1,
    max_ftp_accounts    INT DEFAULT 1,
    max_email_accounts  INT DEFAULT 5,
    price_monthly       DECIMAL(10, 2) NOT NULL,
    is_active           BOOLEAN DEFAULT TRUE,
    display_order       INT DEFAULT 0,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_plans_code (code),
    INDEX idx_plans_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SUBSCRIPTIONS (Orders)
CREATE TABLE IF NOT EXISTS subscriptions  (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    plan_id         BIGINT NOT NULL,
    order_number    VARCHAR(50) NOT NULL UNIQUE,
    status          ENUM('pending', 'paid', 'active', 'suspended', 'cancelled', 'expired') DEFAULT 'pending',
    started_at      TIMESTAMP NULL,
    expires_at      TIMESTAMP NULL,
    cancelled_at    TIMESTAMP NULL,
    price_paid      DECIMAL(10, 2),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    INDEX idx_subs_user (user_id),
    INDEX idx_subs_status (status),
    INDEX idx_subs_number (order_number)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PROJECTS (Domains)
CREATE TABLE IF NOT EXISTS projects (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    project_name    VARCHAR(255) NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_projects_user (user_id),
    INDEX idx_projects_name (project_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SFTP ACCOUNTS
CREATE TABLE IF NOT EXISTS sftp_accounts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    sftp_username   VARCHAR(100) NOT NULL UNIQUE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at   TIMESTAMP NULL,
    home_directory  VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sftp_user (user_id),
    INDEX idx_sftp_username (sftp_username),
    INDEX idx_sftp_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CUSTOMER DATABASES
CREATE TABLE IF NOT EXISTS customer_databases (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    db_name         VARCHAR(64) NOT NULL UNIQUE,
    db_user         VARCHAR(32) NOT NULL UNIQUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_custdb_user (user_id),
    INDEX idx_custdb_name (db_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE email_domains (
   id BIGINT AUTO_INCREMENT PRIMARY KEY,
   domain_name VARCHAR(255) NOT NULL UNIQUE,
   user_id BIGINT NOT NULL,
   is_active BOOLEAN DEFAULT TRUE,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- EMAIL ACCOUNTS
CREATE TABLE IF NOT EXISTS email_accounts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email_address   VARCHAR(255) NOT NULL UNIQUE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at   TIMESTAMP NULL,
    domain_id       BIGINT NOT NULL,
    FOREIGN KEY (domain_id) REFERENCES email_domains(id) ON DELETE CASCADE,
    INDEX idx_email_address (email_address)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    payment_number  VARCHAR(50) NOT NULL UNIQUE,
    amount          DECIMAL(10, 2) NOT NULL,
    currency        VARCHAR(3) DEFAULT 'CZK',
    status          ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_method  ENUM('bank_transfer', 'card', 'simulation') DEFAULT 'simulation',
    paid_at         TIMESTAMP NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_payments_user (user_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_number (payment_number)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NULL,
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(50),
    entity_id       BIGINT,
    ip_address      VARCHAR(45),
    user_agent      VARCHAR(500),
    details         JSON,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;