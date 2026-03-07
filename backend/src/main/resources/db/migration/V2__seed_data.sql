-- ==============================================================================
-- HOSTING CENTRUM - Test Data (seed)
-- Flyway Migration V2
-- ==============================================================================

-- USERS
INSERT INTO users (email, password, username, first_name, last_name, role, is_active, street, city, postal_code, country, phone) VALUES
('admin@hostingcentrum.cz', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.qHXdqmzFAs4fDu', 'admin', 'Admin', 'Hostingu', 'admin', TRUE, NULL, NULL, NULL, 'CZ', NULL),
('jan.novak@mojefirma.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'jnovak', 'Jan', 'Novak', 'customer', TRUE, 'Hlavni 123', 'Praha', '110 00', 'CZ', '+420 777 111 222'),
('petra.svobodova@druhafirma.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'psvobodova', 'Petra', 'Svobodova', 'customer', TRUE, 'Vedlejsi 456', 'Brno', '602 00', 'CZ', '+420 777 333 444'),
('karel.dvorak@tretifirma.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'kdvorak', 'Karel', 'Dvorak', 'customer', TRUE, 'Bocni 789', 'Ostrava', '702 00', 'CZ', '+420 777 555 666'),
('eva.malikova@email.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'emalikova', 'Eva', 'Malikova', 'customer', FALSE, 'Mala 10', 'Plzen', '301 00', 'CZ', '+420 777 777 888'),
('tomas.cerny@firma.cz', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tcerny', 'Tomas', 'Cerny', 'customer', TRUE, 'Dlouha 55', 'Liberec', '460 01', 'CZ', '+420 777 999 000');

-- HOSTING PLANS
INSERT INTO plans (code, name, description, disk_space_mb, max_projects, max_databases, max_ftp_accounts, max_email_accounts, price_monthly, display_order, is_active) VALUES
('basic', 'Basic', 'Basic hosting for small websites and business cards.', 500, 1, 1, 1, 5, 49.00, 1, TRUE),
('premium', 'Premium', 'Extended hosting for company websites and blogs.', 2000, 3, 3, 3, 20, 149.00, 2, TRUE),
('business', 'Business', 'Professional hosting for e-shops and demanding applications.', 10000, 10, 10, 10, 100, 3490.00, 3, TRUE);

-- SUBSCRIPTIONS
INSERT INTO subscriptions (user_id, plan_id, order_number, status, started_at, expires_at, price_paid, created_at, updated_at) VALUES
(2, 1, 'ORD-2024-00001', 'ACTIVE', '2024-01-15 00:00:00', '2025-01-15 00:00:00', 490.00, NOW(), NOW()),
(3, 2, 'ORD-2024-00002', 'ACTIVE', '2024-06-01 00:00:00', '2025-06-01 00:00:00', 149.00, NOW(), NOW()),
(4, 3, 'ORD-2024-00003', 'ACTIVE', '2024-03-10 00:00:00', '2025-03-10 00:00:00', 3490.00, NOW(), NOW()),
(5, 1, 'ORD-2024-00004', 'PENDING', NULL, NULL, NULL, NOW(), NOW()),
(6, 2, 'ORD-2024-00005', 'ACTIVE', '2024-02-20 00:00:00', '2025-02-20 00:00:00', 1490.00, NOW(), NOW());

-- PROJECTS (domains)
INSERT INTO projects (user_id, project_name, is_active, created_at, updated_at) VALUES
(2, 'mojefirma.cz', TRUE, NOW(), NOW()),
(3, 'druhafirma.cz', TRUE, NOW(), NOW()),
(3, 'druha-firma.cz', TRUE, NOW(), NOW()),
(4, 'tretifirma.cz', TRUE, NOW(), NOW()),
(4, 'treti-firma.com', TRUE, NOW(), NOW()),
(4, 'eshop-dvorak.cz', TRUE, NOW(), NOW()),
(6, 'cerny-syn.cz', TRUE, NOW(), NOW());

-- SFTP ACCOUNTS
INSERT INTO sftp_accounts (user_id, sftp_username, is_active, created_at, updated_at, home_directory) VALUES
(2, 'ftp_jnovak', TRUE, NOW(), NOW(), '/var/sftp/ftp_jnovak'),
(3, 'ftp_psvobodova', TRUE, NOW(), NOW(),'/var/sftp/ftp_psvobodova'),
(4, 'ftp_kdvorak', TRUE, NOW(), NOW(),'/var/sftp/ftp_kdvorak'),
(6, 'ftp_tcerny', TRUE, NOW(), NOW(),'/var/sftp/ftp_tcerny');

-- CUSTOMER DATABASES
INSERT INTO customer_databases (user_id, db_name, db_user, created_at, updated_at) VALUES
(2, 'cust_jnovak_wp', 'cust_jnovak',  NOW(), NOW()),
(3, 'cust_psvobodova_web', 'cust_psvobodova',  NOW(), NOW()),
(4, 'cust_kdvorak_eshop', 'cust_kdvorak',  NOW(), NOW());

-- EMAIL ACCOUNTS
INSERT INTO email_accounts (user_id, email_address, is_active, created_at, updated_at) VALUES
(2,  'info@mojefirma.cz', TRUE, NOW(), NOW()),
(2,  'jan@mojefirma.cz', TRUE, NOW(), NOW()),
(3, 'info@druhafirma.cz', TRUE, NOW(), NOW()),
(3,  'petra@druhafirma.cz', TRUE, NOW(), NOW()),
(4,  'info@tretifirma.cz', TRUE, NOW(), NOW()),
(4,  'obchod@tretifirma.cz', TRUE, NOW(), NOW()),
(4,  'podpora@eshop-dvorak.cz', TRUE, NOW(), NOW());

-- PAYMENTS
INSERT INTO payments (user_id,  payment_number, amount, currency, status, payment_method, paid_at, created_at, updated_at) VALUES
(2,  'PAY-2024-00001', 490.00, 'CZK', 'COMPLETED', 'CARD', '2024-01-15 10:30:00', NOW(), NOW()),
(3,  'PAY-2024-00002', 149.00, 'CZK', 'COMPLETED', 'BANK_TRANSFER', '2024-06-01 14:22:00', NOW(), NOW()),
(4,  'PAY-2024-00003', 3490.00, 'CZK', 'COMPLETED', 'CARD', '2024-03-10 09:15:00', NOW(), NOW()),
(6,  'PAY-2024-00005', 1490.00, 'CZK', 'COMPLETED', 'SIMULATION', '2024-02-20 16:45:00', NOW(), NOW()),
(5, 'PAY-2024-00004', 49.00, 'CZK', 'PENDING', 'BANK_TRANSFER', NULL, NOW(), NOW());

-- AUDIT LOGS
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, details, created_at) VALUES
(1, 'user.login', 'user', 1, '127.0.0.1', '{"browser": "Chrome"}', NOW()),
(2, 'user.login', 'user', 2, '192.168.1.100', '{"browser": "Firefox"}', NOW()),
(2, 'subscription.create', 'subscription', 1, '192.168.1.100', '{"plan": "basic"}', NOW()),
(3, 'user.register', 'user', 3, '10.0.0.50', '{"source": "web"}', NOW()),
(4, 'sftp.created', 'sftp_account', 3, '172.16.0.1', '{"username": "ftp_kdvorak"}', NOW());