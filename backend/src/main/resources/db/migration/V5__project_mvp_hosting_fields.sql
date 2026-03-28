ALTER TABLE projects
    ADD COLUMN slug VARCHAR(255) NULL AFTER project_name,
    ADD COLUMN plan_id BIGINT NULL AFTER user_id,
    ADD COLUMN ftp_host VARCHAR(255) NULL AFTER publication_status,
    ADD COLUMN ftp_port INT NULL AFTER ftp_host,
    ADD COLUMN ftp_username VARCHAR(120) NULL AFTER ftp_port,
    ADD COLUMN ftp_password_encrypted VARCHAR(512) NULL AFTER ftp_username;

ALTER TABLE projects
    ADD CONSTRAINT fk_projects_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL;

UPDATE projects
SET slug = REPLACE(project_name, '.', '-'),
    ftp_host = 'localhost',
    ftp_port = 21,
    ftp_username = CONCAT('legacy_', id)
WHERE slug IS NULL;
