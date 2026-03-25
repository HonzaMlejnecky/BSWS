UPDATE projects
SET runtime = 'static'
WHERE runtime IS NULL OR TRIM(runtime) = '';

ALTER TABLE projects
    MODIFY COLUMN runtime VARCHAR(20) NOT NULL DEFAULT 'static';
