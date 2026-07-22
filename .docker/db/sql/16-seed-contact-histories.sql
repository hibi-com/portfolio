-- Seed data for contact_histories table (depends on customers; optional user_id)
INSERT OR IGNORE INTO "contact_histories" ("id", "customer_id", "user_id", "type", "subject", "content", "contacted_at", "created_at", "updated_at")
VALUES
    ('ch000000-0000-0000-0000-00000000001', 'c0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'EMAIL', 'Initial contact', 'First contact with customer.', datetime('now'), datetime('now'), datetime('now'));
