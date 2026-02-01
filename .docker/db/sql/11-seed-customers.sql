-- Seed data for customers table
USE portfolio;

INSERT INTO `customers` (`id`, `name`, `email`, `phone`, `company`, `website`, `address`, `notes`, `status`, `tags`, `custom_fields`, `created_at`, `updated_at`)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Sample Customer A', 'customer-a@example.com', '090-0000-0001', 'Company A', 'https://example.com/a', NULL, NULL, 'ACTIVE', NULL, NULL, NOW(), NOW()),
    ('c0000000-0000-0000-0000-000000000002', 'Sample Customer B', 'customer-b@example.com', NULL, 'Company B', NULL, NULL, 'Prospect from web', 'PROSPECT', NULL, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();
