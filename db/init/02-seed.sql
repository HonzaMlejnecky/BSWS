-- ==============================================================================
-- HOSTING CENTRUM - Testovaci data (seed)
--
-- Tento soubor vytvari testovaci data pro vyvoj.
--
-- Hesla:
--   - admin123  -> bcrypt hash nize
--   - test1234  -> bcrypt hash nize
--   - ftp123    -> cleartext (pro Pure-FTPd)
--
-- Reset DB: docker-compose down -v && docker-compose up -d --build
-- ==============================================================================

USE hosting_platform;

-- =============================================================================
-- UZIVATELE
-- =============================================================================

-- Admin (heslo: admin123)
INSERT INTO users (email, password_hash, username, first_name, last_name, role, is_verified) VALUES
('admin@hostingcentrum.cz', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.qHXdqmzFAs4fDu', 'admin', 'Admin', 'Hostingu', 'admin', TRUE);

-- Testovaci zakaznici (heslo: test1234)
INSERT INTO users (email, password_hash, username, first_name, last_name, company_name, phone, street, city, postal_code, role, is_verified) VALUES
('jan.novak@mojefirma.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'jnovak', 'Jan', 'Novák', 'Moje Firma s.r.o.', '+420 777 111 222', 'Hlavní 123', 'Praha', '110 00', 'customer', TRUE),
('petra.svobodova@druhafirma.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'psvobodova', 'Petra', 'Svobodová', 'Druhá Firma a.s.', '+420 777 333 444', 'Vedlejší 456', 'Brno', '602 00', 'customer', TRUE),
('karel.dvorak@tretifirma.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'kdvorak', 'Karel', 'Dvořák', 'Třetí Firma s.r.o.', '+420 777 555 666', 'Boční 789', 'Ostrava', '702 00', 'customer', TRUE),
('eva.malikova@email.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'emalikova', 'Eva', 'Malíková', NULL, '+420 777 777 888', 'Malá 10', 'Plzeň', '301 00', 'customer', FALSE),
('tomas.cerny@firma.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tcerny', 'Tomáš', 'Černý', 'Černý & syn', '+420 777 999 000', 'Dlouhá 55', 'Liberec', '460 01', 'customer', TRUE);

-- =============================================================================
-- HOSTINGOVE PLANY
-- =============================================================================

INSERT INTO hosting_plans (code, name, description, disk_space_mb, bandwidth_mb, max_domains, max_databases, max_ftp_accounts, max_email_accounts, price_monthly, price_yearly, display_order) VALUES
('basic', 'Basic', 'Základní hosting pro malé weby a vizitky. Ideální pro začátečníky.', 500, 10000, 1, 1, 1, 5, 49.00, 490.00, 1),
('premium', 'Premium', 'Rozšířený hosting pro firemní weby a blogy. Více prostoru a funkcí.', 2000, 50000, 3, 3, 3, 20, 149.00, 1490.00, 2),
('business', 'Business', 'Profesionální hosting pro e-shopy a náročné aplikace. Nejvyšší výkon.', 10000, 200000, 10, 10, 10, 100, 349.00, 3490.00, 3);

-- =============================================================================
-- OBJEDNAVKY
-- =============================================================================

-- Jan Novak - Basic plan, aktivni
INSERT INTO orders (user_id, plan_id, order_number, status, billing_cycle, started_at, expires_at, price_paid) VALUES
(2, 1, 'ORD-2024-00001', 'active', 'yearly', '2024-01-15 00:00:00', '2025-01-15 00:00:00', 490.00);

-- Petra Svobodova - Premium plan, aktivni
INSERT INTO orders (user_id, plan_id, order_number, status, billing_cycle, started_at, expires_at, price_paid) VALUES
(3, 2, 'ORD-2024-00002', 'active', 'monthly', '2024-06-01 00:00:00', '2025-06-01 00:00:00', 149.00);

-- Karel Dvorak - Business plan, aktivni
INSERT INTO orders (user_id, plan_id, order_number, status, billing_cycle, started_at, expires_at, price_paid) VALUES
(4, 3, 'ORD-2024-00003', 'active', 'yearly', '2024-03-10 00:00:00', '2025-03-10 00:00:00', 3490.00);

-- Eva Malikova - Basic plan, pending (ceka na platbu)
INSERT INTO orders (user_id, plan_id, order_number, status, billing_cycle, price_paid) VALUES
(5, 1, 'ORD-2024-00004', 'pending', 'monthly', NULL);

-- Tomas Cerny - Premium plan, aktivni
INSERT INTO orders (user_id, plan_id, order_number, status, billing_cycle, started_at, expires_at, price_paid) VALUES
(6, 2, 'ORD-2024-00005', 'active', 'yearly', '2024-02-20 00:00:00', '2025-02-20 00:00:00', 1490.00);

-- =============================================================================
-- DOMENY
-- =============================================================================

-- Jan Novak
INSERT INTO domains (user_id, order_id, domain_name, is_primary) VALUES
(2, 1, 'mojefirma.cz', TRUE);

-- Petra Svobodova
INSERT INTO domains (user_id, order_id, domain_name, is_primary) VALUES
(3, 2, 'druhafirma.cz', TRUE),
(3, 2, 'druha-firma.cz', FALSE);

-- Karel Dvorak
INSERT INTO domains (user_id, order_id, domain_name, is_primary) VALUES
(4, 3, 'tretifirma.cz', TRUE),
(4, 3, 'treti-firma.com', FALSE),
(4, 3, 'eshop-dvorak.cz', FALSE);

-- Tomas Cerny
INSERT INTO domains (user_id, order_id, domain_name, is_primary) VALUES
(6, 5, 'cerny-syn.cz', TRUE);

-- =============================================================================
-- FTP UCTY
-- Pure-FTPd cte primo z teto tabulky!
-- Heslo: ftp123 (v cleartext pro jednoduchost, v produkci pouzijte MD5)
-- =============================================================================

INSERT INTO ftp_accounts (user_id, order_id, ftp_username, ftp_password, home_dir, quota_mb) VALUES
(2, 1, 'ftp_jnovak', 'ftp123', '/srv/customers/user_2', 500),
(3, 2, 'ftp_psvobodova', 'ftp123', '/srv/customers/user_3', 2000),
(4, 3, 'ftp_kdvorak', 'ftp123', '/srv/customers/user_4', 10000),
(6, 5, 'ftp_tcerny', 'ftp123', '/srv/customers/user_6', 2000);

-- =============================================================================
-- ZAKAZNICKE DATABAZE (metadata)
-- Skutecne DB se vytvori az backend zavola CREATE DATABASE
-- =============================================================================

INSERT INTO customer_databases (user_id, order_id, db_name, db_user, db_password, description) VALUES
(2, 1, 'cust_jnovak_wp', 'cust_jnovak', 'wp_secret_123', 'WordPress databáze'),
(3, 2, 'cust_psvobodova_web', 'cust_psvobodova', 'web_secret_456', 'Firemní web'),
(4, 3, 'cust_kdvorak_eshop', 'cust_kdvorak', 'eshop_secret_789', 'E-shop databáze');

-- =============================================================================
-- EMAILOVE UCTY
-- =============================================================================

INSERT INTO email_accounts (user_id, order_id, domain_id, email_address, email_password, quota_mb) VALUES
(2, 1, 1, 'info@mojefirma.cz', 'email_secret_111', 500),
(2, 1, 1, 'jan@mojefirma.cz', 'email_secret_112', 500),
(3, 2, 2, 'info@druhafirma.cz', 'email_secret_222', 1000),
(3, 2, 2, 'petra@druhafirma.cz', 'email_secret_223', 1000),
(4, 3, 4, 'info@tretifirma.cz', 'email_secret_333', 2000),
(4, 3, 4, 'obchod@tretifirma.cz', 'email_secret_334', 2000),
(4, 3, 6, 'podpora@eshop-dvorak.cz', 'email_secret_335', 2000);

-- =============================================================================
-- PLATBY
-- =============================================================================

INSERT INTO payments (user_id, order_id, payment_number, amount, currency, status, payment_method, paid_at) VALUES
(2, 1, 'PAY-2024-00001', 490.00, 'CZK', 'completed', 'card', '2024-01-15 10:30:00'),
(3, 2, 'PAY-2024-00002', 149.00, 'CZK', 'completed', 'bank_transfer', '2024-06-01 14:22:00'),
(4, 3, 'PAY-2024-00003', 3490.00, 'CZK', 'completed', 'card', '2024-03-10 09:15:00'),
(6, 5, 'PAY-2024-00005', 1490.00, 'CZK', 'completed', 'simulation', '2024-02-20 16:45:00');

-- Pending platba pro Evu
INSERT INTO payments (user_id, order_id, payment_number, amount, currency, status, payment_method) VALUES
(5, 4, 'PAY-2024-00004', 49.00, 'CZK', 'pending', 'bank_transfer');

-- =============================================================================
-- AUDIT LOG - ukazkove zaznamy
-- =============================================================================

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, details) VALUES
(1, 'user.login', 'user', 1, '127.0.0.1', '{"browser": "Chrome"}'),
(2, 'user.login', 'user', 2, '192.168.1.100', '{"browser": "Firefox"}'),
(2, 'order.create', 'order', 1, '192.168.1.100', '{"plan": "basic"}'),
(3, 'user.register', 'user', 3, '10.0.0.50', '{"source": "web"}'),
(4, 'ftp.created', 'ftp_account', 3, '172.16.0.1', '{"username": "ftp_kdvorak"}');

-- =============================================================================
-- KONEC SEED DAT
-- =============================================================================
