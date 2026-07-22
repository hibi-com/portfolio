-- Seed data for leads table (optional customer_id)
INSERT OR IGNORE INTO "leads" ("id", "customer_id", "name", "email", "phone", "company", "source", "status", "score", "notes", "converted_at", "created_at", "updated_at")
VALUES
    ('l0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Lead One', 'lead1@example.com', NULL, 'Company A', 'web', 'NEW', 60, NULL, NULL, datetime('now'), datetime('now'));
