-- ==============================================================================
-- HOSTING CENTRUM - Test Data (seed)
-- Flyway Migration V2
--
-- Passwords:
--   - admin123  -> bcrypt hash below
--   - test1234  -> bcrypt hash below
--   - ftp123    -> cleartext (for Pure-FTPd)
-- ==============================================================================

-- =============================================================================
-- USERS
-- =============================================================================

-- Admin (password: admin123)
INSERT INTO users (email, password_hash, username, first_name, last_name, role, is_verified) VALUES
('admin@hostingcentrum.cz', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.qHXdqmzFAs4fDu', 'admin', 'Admin', 'Hostingu', 'admin', TRUE);

-- Test customers (password: test1234)
INSERT INTO users (email, password_hash, username, first_name, last_name, company_name, phone, street, city, postal_code, role, is_verified) VALUES
('jan.novak@mojefirma.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'jnovak', 'Jan', 'Novak', 'Moje Firma s.r.o.', '+420 777 111 222', 'Hlavni 123', 'Praha', '110 00', 'customer', TRUE),
('petra.svobodova@druhafirma.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'psvobodova', 'Petra', 'Svobodova', 'Druha Firma a.s.', '+420 777 333 444', 'Vedlejsi 456', 'Brno', '602 00', 'customer', TRUE),
('karel.dvorak@tretifirma.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'kdvorak', 'Karel', 'Dvorak', 'Treti Firma s.r.o.', '+420 777 555 666', 'Bocni 789', 'Ostrava', '702 00', 'customer', TRUE),
('eva.malikova@email.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'emalikova', 'Eva', 'Malikova', NULL, '+420 777 777 888', 'Mala 10', 'Plzen', '301 00', 'customer', FALSE),
('tomas.cerny@firma.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tcerny', 'Tomas', 'Cerny', 'Cerny & syn', '+420 777 999 000', 'Dlouha 55', 'Liberec', '460 01', 'customer', TRUE);

-- =============================================================================
-- HOSTING PLANS
-- =============================================================================

INSERT INTO hosting_plans (code, name, description, disk_space_mb, bandwidth_mb, max_domains, max_databases, max_ftp_accounts, max_email_accounts, price_monthly, price_yearly, display_order) VALUES
('basic', 'Basic', 'Basic hosting for small websites and business cards. Ideal for beginners.', 500, 10000, 1, 1, 1, 5, 49.00, 490.00, 1),
('premium', 'Premium', 'Extended hosting for company websites and blogs. More space and features.', 2000, 50000, 3, 3, 3, 20, 149.00, 1490.00, 2),
('business', 'Business', 'Professional hosting for e-shops and demanding applications. Highest performance.', 10000, 200000, 10, 10, 10, 100, 349.00, 3490.00, 3);

-- =============================================================================
-- ORDERS
-- =============================================================================

-- Jan Novak - Basic plan, active
INSERT INTO orders (user_id, plan_id, order_number, status, billing_cycle, started_at, expires_at, price_paid) VALUES
(2, 1, 'ORD-2024-00001', 'active', 'yearly', '2024-01-15 00:00:00', '2025-01-15 00:00:00', 490.00);

-- Petra Svobodova - Premium plan, active
INSERT INTO orders (user_id, plan_id, order_number, status, billing_cycle, started_at, expires_at, price_paid) VALUES
(3, 2, 'ORD-2024-00002', 'active', 'monthly', '2024-06-01 00:00:00', '2025-06-01 00:00:00', 149.00);

-- Karel Dvorak - Business plan, active
INSERT INTO orders (user_id, plan_id, order_number, status, billing_cycle, started_at, expires_at, price_paid) VALUES
(4, 3, 'ORD-2024-00003', 'active', 'yearly', '2024-03-10 00:00:00', '2025-03-10 00:00:00', 3490.00);

-- Eva Malikova - Basic plan, pending (awaiting payment)
INSERT INTO orders (user_id, plan_id, order_number, status, billing_cycle, price_paid) VALUES
(5, 1, 'ORD-2024-00004', 'pending', 'monthly', NULL);

-- Tomas Cerny - Premium plan, active
INSERT INTO orders (user_id, plan_id, order_number, status, billing_cycle, started_at, expires_at, price_paid) VALUES
(6, 2, 'ORD-2024-00005', 'active', 'yearly', '2024-02-20 00:00:00', '2025-02-20 00:00:00', 1490.00);

-- =============================================================================
-- DOMAINS
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
-- FTP ACCOUNTS
-- Pure-FTPd reads directly from this table!
-- Password: ftp123 (cleartext for simplicity, use MD5 in production)
-- =============================================================================

INSERT INTO ftp_accounts (user_id, order_id, ftp_username, ftp_password, home_dir, quota_mb) VALUES
(2, 1, 'ftp_jnovak', 'ftp123', '/srv/customers/user_2', 500),
(3, 2, 'ftp_psvobodova', 'ftp123', '/srv/customers/user_3', 2000),
(4, 3, 'ftp_kdvorak', 'ftp123', '/srv/customers/user_4', 10000),
(6, 5, 'ftp_tcerny', 'ftp123', '/srv/customers/user_6', 2000);

-- =============================================================================
-- CUSTOMER DATABASES (metadata)
-- Actual databases are created when backend calls CREATE DATABASE
-- =============================================================================

INSERT INTO customer_databases (user_id, order_id, db_name, db_user, db_password, description) VALUES
(2, 1, 'cust_jnovak_wp', 'cust_jnovak', 'wp_secret_123', 'WordPress database'),
(3, 2, 'cust_psvobodova_web', 'cust_psvobodova', 'web_secret_456', 'Company website'),
(4, 3, 'cust_kdvorak_eshop', 'cust_kdvorak', 'eshop_secret_789', 'E-shop database');

-- =============================================================================
-- EMAIL ACCOUNTS
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
-- PAYMENTS
-- =============================================================================

INSERT INTO payments (user_id, order_id, payment_number, amount, currency, status, payment_method, paid_at) VALUES
(2, 1, 'PAY-2024-00001', 490.00, 'CZK', 'completed', 'card', '2024-01-15 10:30:00'),
(3, 2, 'PAY-2024-00002', 149.00, 'CZK', 'completed', 'bank_transfer', '2024-06-01 14:22:00'),
(4, 3, 'PAY-2024-00003', 3490.00, 'CZK', 'completed', 'card', '2024-03-10 09:15:00'),
(6, 5, 'PAY-2024-00005', 1490.00, 'CZK', 'completed', 'simulation', '2024-02-20 16:45:00');

-- Pending payment for Eva
INSERT INTO payments (user_id, order_id, payment_number, amount, currency, status, payment_method) VALUES
(5, 4, 'PAY-2024-00004', 49.00, 'CZK', 'pending', 'bank_transfer');

-- =============================================================================
-- AUDIT LOG - sample records
-- =============================================================================

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, details) VALUES
(1, 'user.login', 'user', 1, '127.0.0.1', '{"browser": "Chrome"}'),
(2, 'user.login', 'user', 2, '192.168.1.100', '{"browser": "Firefox"}'),
(2, 'order.create', 'order', 1, '192.168.1.100', '{"plan": "basic"}'),
(3, 'user.register', 'user', 3, '10.0.0.50', '{"source": "web"}'),
(4, 'ftp.created', 'ftp_account', 3, '172.16.0.1', '{"username": "ftp_kdvorak"}');
