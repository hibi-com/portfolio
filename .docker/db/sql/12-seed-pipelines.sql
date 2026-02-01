-- Seed data for pipelines table
USE portfolio;

INSERT INTO `pipelines` (`id`, `name`, `description`, `is_default`, `created_at`, `updated_at`)
VALUES
    ('p0000000-0000-0000-0000-000000000001', 'Sales Pipeline', 'Default sales pipeline', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();
