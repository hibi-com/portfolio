-- Seed data for deals table (depends on pipeline_stages; optional customer_id, lead_id)
INSERT OR IGNORE INTO "deals" ("id", "customer_id", "lead_id", "stage_id", "name", "value", "currency", "expected_close_date", "actual_close_date", "status", "notes", "lost_reason", "created_at", "updated_at")
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', NULL, 'ps000000-0000-0000-0000-00000000002', 'Deal Sample', 100000.00, 'JPY', datetime('now', '+30 day'), NULL, 'OPEN', NULL, NULL, datetime('now'), datetime('now'));
