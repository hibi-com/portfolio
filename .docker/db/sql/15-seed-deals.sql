-- Seed data for deals table (depends on pipeline_stages; optional customer_id, lead_id)
USE portfolio;

INSERT INTO `deals` (`id`, `customer_id`, `lead_id`, `stage_id`, `name`, `value`, `currency`, `expected_close_date`, `actual_close_date`, `status`, `notes`, `lost_reason`, `created_at`, `updated_at`)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', NULL, 'ps000000-0000-0000-0000-00000000002', 'Deal Sample', 100000.00, 'JPY', DATE_ADD(NOW(), INTERVAL 30 DAY), NULL, 'OPEN', NULL, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();
