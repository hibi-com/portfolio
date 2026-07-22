-- Seed data for account table
-- This script runs after database initialization

-- Insert sample account data
INSERT OR IGNORE INTO "account" ("id", "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", "scope", "password", "createdAt", "updatedAt")
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
        datetime('now'),
        datetime('now')
    );
