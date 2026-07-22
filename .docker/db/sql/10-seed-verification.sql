-- Seed data for verification table
INSERT OR IGNORE INTO "verification" ("id", "identifier", "value", "expiresAt", "createdAt", "updatedAt")
VALUES
    ('v0000000-0000-0000-0000-000000000001', 'email:user@example.com', 'verification-code-001', datetime('now', '+1 hour'), datetime('now'), datetime('now'));
