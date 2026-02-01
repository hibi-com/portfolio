-- Seed data for inquiry_responses table (depends on inquiries; optional user_id)
USE portfolio;

INSERT INTO `inquiry_responses` (`id`, `inquiry_id`, `user_id`, `content`, `is_internal`, `attachments`, `created_at`, `updated_at`)
VALUES
    ('ir000000-0000-0000-0000-0000000001', 'i0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Thank you for your inquiry. We will get back to you soon.', false, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();
