-- Seed data for pipeline_stages table (depends on pipelines)

INSERT OR IGNORE INTO "pipeline_stages" ("id", "pipeline_id", "name", "order", "probability", "color", "created_at", "updated_at")
VALUES
    ('ps000000-0000-0000-0000-00000000001', 'p0000000-0000-0000-0000-000000000001', 'Lead', 1, 10, '#94a3b8', datetime('now'), datetime('now')),
    ('ps000000-0000-0000-0000-00000000002', 'p0000000-0000-0000-0000-000000000001', 'Qualified', 2, 50, '#60a5fa', datetime('now'), datetime('now')),
    ('ps000000-0000-0000-0000-00000000003', 'p0000000-0000-0000-0000-000000000001', 'Proposal', 3, 75, '#a78bfa', datetime('now'), datetime('now')),
    ('ps000000-0000-0000-0000-00000000004', 'p0000000-0000-0000-0000-000000000001', 'Won', 4, 100, '#34d399', datetime('now'), datetime('now'));
