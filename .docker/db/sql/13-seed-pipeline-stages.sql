-- Seed data for pipeline_stages table (depends on pipelines)
USE portfolio;

SET @pipeline_id = 'p0000000-0000-0000-0000-000000000001';

INSERT INTO `pipeline_stages` (`id`, `pipeline_id`, `name`, `order`, `probability`, `color`, `created_at`, `updated_at`)
VALUES
    ('ps000000-0000-0000-0000-00000000001', @pipeline_id, 'Lead', 1, 10, '#94a3b8', NOW(), NOW()),
    ('ps000000-0000-0000-0000-00000000002', @pipeline_id, 'Qualified', 2, 50, '#60a5fa', NOW(), NOW()),
    ('ps000000-0000-0000-0000-00000000003', @pipeline_id, 'Proposal', 3, 75, '#a78bfa', NOW(), NOW()),
    ('ps000000-0000-0000-0000-00000000004', @pipeline_id, 'Won', 4, 100, '#34d399', NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();
