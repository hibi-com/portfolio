-- Seed data for verification table
USE portfolio;

INSERT INTO `verification` (`id`, `identifier`, `value`, `expiresAt`, `createdAt`, `updatedAt`)
VALUES
    ('v0000000-0000-0000-0000-000000000001', 'email:user@example.com', 'verification-code-001', DATE_ADD(NOW(), INTERVAL 1 HOUR), NOW(), NOW())
ON DUPLICATE KEY UPDATE `updatedAt` = NOW();
