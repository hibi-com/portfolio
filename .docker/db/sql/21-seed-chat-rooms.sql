-- Seed data for chat_rooms table (optional customer_id, inquiry_id)
USE portfolio;

INSERT INTO `chat_rooms` (`id`, `customer_id`, `inquiry_id`, `name`, `status`, `metadata`, `closed_at`, `created_at`, `updated_at`)
VALUES
    ('cr000000-0000-0000-0000-00000000001', 'c0000000-0000-0000-0000-000000000001', NULL, 'Sample Chat', 'ACTIVE', NULL, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();
