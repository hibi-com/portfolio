-- Seed data for inquiries table (optional customer_id, assignee_id=user)
USE portfolio;

INSERT INTO `inquiries` (`id`, `customer_id`, `assignee_id`, `subject`, `content`, `status`, `priority`, `category`, `tags`, `source`, `metadata`, `resolved_at`, `closed_at`, `created_at`, `updated_at`)
VALUES
    ('i0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Sample inquiry', 'Sample inquiry content from customer.', 'OPEN', 'MEDIUM', 'GENERAL', NULL, 'web', NULL, NULL, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();
