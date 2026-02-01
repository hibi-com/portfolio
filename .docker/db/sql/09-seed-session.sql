-- Seed data for session table (depends on user)
USE portfolio;

INSERT INTO `session` (`id`, `expiresAt`, `token`, `createdAt`, `updatedAt`, `ipAddress`, `userAgent`, `userId`)
VALUES
    ('s0000000-0000-0000-0000-000000000001', DATE_ADD(NOW(), INTERVAL 7 DAY), 'dev-session-token-001', NOW(), NOW(), NULL, NULL, '00000000-0000-0000-0000-000000000001')
ON DUPLICATE KEY UPDATE `updatedAt` = NOW();
