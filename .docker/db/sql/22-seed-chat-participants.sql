-- Seed data for chat_participants table (depends on chat_rooms; optional user_id)
INSERT OR IGNORE INTO "chat_participants" ("id", "chat_room_id", "user_id", "name", "role", "is_online", "last_seen_at", "joined_at", "left_at", "created_at", "updated_at")
VALUES
    ('cp000000-0000-0000-0000-00000000001', 'cr000000-0000-0000-0000-00000000001', '00000000-0000-0000-0000-000000000001', 'Agent One', 'AGENT', false, NULL, datetime('now'), NULL, datetime('now'), datetime('now')),
    ('cp000000-0000-0000-0000-00000000002', 'cr000000-0000-0000-0000-00000000001', NULL, 'Customer', 'CUSTOMER', false, NULL, datetime('now'), NULL, datetime('now'), datetime('now'));
