-- Seed data for account table
-- This script runs after database initialization

USE portfolio;

-- Insert sample account data
INSERT INTO `account` (`id`, `accountId`, `providerId`, `userId`, `accessToken`, `refreshToken`, `idToken`, `accessTokenExpiresAt`, `refreshTokenExpiresAt`, `scope`, `password`, `createdAt`, `updatedAt`)
VALUES
    (
        'a0000000-0000-0000-0000-000000000001',
        '123456789',
        'github',
        '00000000-0000-0000-0000-000000000001',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        'read:user',
        NULL,
        NOW(),
        NOW()
    )
ON DUPLICATE KEY UPDATE `updatedAt` = NOW();
