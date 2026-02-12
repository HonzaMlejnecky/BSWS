-- ==============================================================================
-- HOSTING CENTRUM - Databazove schema (PLACEHOLDER)
--
-- TYM DATABAZE: Tento soubor je UKAZKA. Vytvorte kompletni schema.
--
-- Pozadavky:
--   1. Platformova DB (hosting_platform) - uzivatele, objednavky, FTP ucty, ...
--   2. Mechanismus pro zakaznicke DB - CREATE DATABASE, CREATE USER, GRANT
--
-- Soubory pojmenovavejte: 01-schema.sql, 02-seed.sql, 03-xxx.sql
-- Spousti se ABECEDNE pri prvnim startu kontejneru.
--
-- Reset DB: docker-compose down -v && docker-compose up -d --build
-- ==============================================================================

USE hosting_platform;

-- -----------------------------------------------------------------------------
-- UKAZKA: Tabulka users
-- TYM DATABAZE: Rozsirte podle specifikace!
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    username        VARCHAR(100) NOT NULL,
    role            ENUM('customer', 'admin') DEFAULT 'customer',
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- UKAZKA: Testovaci data
-- -----------------------------------------------------------------------------

-- Admin (heslo: admin123 - ZMENTE V PRODUKCI!)
INSERT INTO users (email, password_hash, username, role) VALUES
('admin@hostingcentrum.cz', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.qHXdqmzFAs4fDu', 'admin', 'admin');

-- Testovaci zakaznik (heslo: test1234)
INSERT INTO users (email, password_hash, username, role) VALUES
('test@mojefirma.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'testuser', 'customer');

-- -----------------------------------------------------------------------------
-- TODO PRO TYM DATABAZE:
-- -----------------------------------------------------------------------------
-- [ ] hosting_plans - tarify (Basic, Premium, Business)
-- [ ] orders - objednavky hostingu
-- [ ] domains - domeny zakazniku
-- [ ] ftp_accounts - FTP ucty (Pure-FTPd cte z teto tabulky!)
-- [ ] customer_databases - zakaznicke DB
-- [ ] email_accounts - emailove schranky
-- [ ] payments - platby (simulace)
-- [ ] audit_logs - systemovy log
-- -----------------------------------------------------------------------------
