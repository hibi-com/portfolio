-- Seed data for pipelines table
INSERT OR IGNORE INTO "pipelines" ("id", "name", "description", "is_default", "created_at", "updated_at")
VALUES
    ('p0000000-0000-0000-0000-000000000001', 'Sales Pipeline', 'Default sales pipeline', true, datetime('now'), datetime('now'));
