-- Refresh product-ready hosting plan catalog

UPDATE plans
SET code = 'standard',
    name = 'Standard',
    description = 'Balanced hosting for company websites with FTP and in-app file upload.',
    disk_space_mb = 2048,
    max_projects = 3,
    max_databases = 3,
    max_ftp_accounts = 3,
    max_email_accounts = 20,
    price_monthly = 149.00,
    display_order = 2,
    is_active = TRUE
WHERE code = 'premium';

UPDATE plans
SET code = 'premium',
    name = 'Premium',
    description = 'High-capacity hosting for advanced websites with priority provisioning options.',
    disk_space_mb = 10240,
    max_projects = 10,
    max_databases = 10,
    max_ftp_accounts = 10,
    max_email_accounts = 100,
    price_monthly = 349.00,
    display_order = 3,
    is_active = TRUE
WHERE code = 'business';

UPDATE plans
SET name = 'Basic',
    description = 'Starter hosting for one web project with FTP access and standard publication workflow.',
    disk_space_mb = 1024,
    max_projects = 1,
    max_databases = 1,
    max_ftp_accounts = 1,
    max_email_accounts = 5,
    price_monthly = 79.00,
    display_order = 1,
    is_active = TRUE
WHERE code = 'basic';

INSERT INTO plans (code, name, description, disk_space_mb, max_projects, max_databases, max_ftp_accounts, max_email_accounts, price_monthly, display_order, is_active, created_at)
SELECT 'basic', 'Basic', 'Starter hosting for one web project with FTP access and standard publication workflow.', 1024, 1, 1, 1, 5, 79.00, 1, TRUE, NOW()
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE code = 'basic');

INSERT INTO plans (code, name, description, disk_space_mb, max_projects, max_databases, max_ftp_accounts, max_email_accounts, price_monthly, display_order, is_active, created_at)
SELECT 'standard', 'Standard', 'Balanced hosting for company websites with FTP and in-app file upload.', 2048, 3, 3, 3, 20, 149.00, 2, TRUE, NOW()
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE code = 'standard');

INSERT INTO plans (code, name, description, disk_space_mb, max_projects, max_databases, max_ftp_accounts, max_email_accounts, price_monthly, display_order, is_active, created_at)
SELECT 'premium', 'Premium', 'High-capacity hosting for advanced websites with priority provisioning options.', 10240, 10, 10, 10, 100, 349.00, 3, TRUE, NOW()
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE code = 'premium');
