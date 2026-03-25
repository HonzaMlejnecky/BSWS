ALTER TABLE projects
    ADD COLUMN domain VARCHAR(255) NULL AFTER project_name,
    ADD COLUMN document_root VARCHAR(255) NULL AFTER domain,
    ADD COLUMN runtime VARCHAR(20) NULL AFTER document_root,
    ADD COLUMN publication_status VARCHAR(30) NULL AFTER runtime;

UPDATE projects
SET domain = project_name
WHERE domain IS NULL;

UPDATE projects
SET document_root = CONCAT('/var/www/', REPLACE(project_name, '.', '_'))
WHERE document_root IS NULL;

UPDATE projects
SET runtime = 'static'
WHERE runtime IS NULL;

UPDATE projects
SET publication_status = CASE WHEN is_active THEN 'published' ELSE 'draft' END
WHERE publication_status IS NULL;

ALTER TABLE projects
    MODIFY COLUMN domain VARCHAR(255) NOT NULL,
    MODIFY COLUMN document_root VARCHAR(255) NOT NULL,
    MODIFY COLUMN runtime VARCHAR(20) NOT NULL,
    MODIFY COLUMN publication_status VARCHAR(30) NOT NULL,
    ADD CONSTRAINT uq_projects_domain UNIQUE (domain);
