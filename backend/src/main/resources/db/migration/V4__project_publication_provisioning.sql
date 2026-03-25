ALTER TABLE projects
    ADD COLUMN provisioning_error TEXT NULL AFTER publication_status;

UPDATE projects
SET publication_status = 'draft'
WHERE publication_status NOT IN ('draft', 'published', 'failed');
