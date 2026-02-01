-- Seed data for email_templates table
USE portfolio;

INSERT INTO `email_templates` (`id`, `name`, `slug`, `description`, `category`, `subject`, `html_content`, `text_content`, `variables`, `is_active`, `created_at`, `updated_at`)
VALUES
    ('et000000-0000-0000-0000-00000000001', 'Welcome Email', 'welcome-email', 'Welcome email for new users', 'TRANSACTIONAL', 'Welcome to Portfolio', '<p>Hello {{name}}, welcome!</p>', 'Hello {{name}}, welcome!', '["name"]', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();
