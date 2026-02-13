
USE hosting_platform;
SET FOREIGN_KEY_CHECKS = 0;

-- drop tables
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS email_accounts;
DROP TABLE IF EXISTS customer_databases;
DROP TABLE IF EXISTS ftp_accounts;
DROP TABLE IF EXISTS domains;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS hosting_plans;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;