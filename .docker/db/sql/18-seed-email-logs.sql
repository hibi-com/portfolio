-- Seed data for email_logs table (optional customer_id, template_id)
USE portfolio;

INSERT INTO `email_logs` (`id`, `customer_id`, `template_id`, `resend_id`, `from_email`, `to_email`, `cc_email`, `bcc_email`, `subject`, `html_content`, `text_content`, `status`, `error_message`, `sent_at`, `delivered_at`, `opened_at`, `clicked_at`, `bounced_at`, `metadata`, `created_at`, `updated_at`)
VALUES
    ('el000000-0000-0000-0000-00000000001', 'c0000000-0000-0000-0000-000000000001', NULL, NULL, 'noreply@example.com', 'customer-a@example.com', NULL, NULL, 'Sample Email', '<p>Sample content</p>', 'Sample content', 'SENT', NULL, NOW(), NULL, NULL, NULL, NULL, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();
