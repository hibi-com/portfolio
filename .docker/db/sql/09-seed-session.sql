-- Seed data for session table (depends on user)
INSERT OR IGNORE INTO "session" ("id", "expiresAt", "token", "createdAt", "updatedAt", "ipAddress", "userAgent", "userId")
VALUES
    ('s0000000-0000-0000-0000-000000000001', datetime('now', '+7 day'), 'dev-session-token-001', datetime('now'), datetime('now'), NULL, NULL, '00000000-0000-0000-0000-000000000001');
