-- Seed data for chat_messages table (depends on chat_rooms, chat_participants)
INSERT OR IGNORE INTO "chat_messages" ("id", "chat_room_id", "participant_id", "type", "content", "metadata", "read_by", "created_at", "updated_at")
VALUES
    ('cm000000-0000-0000-0000-00000000001', 'cr000000-0000-0000-0000-00000000001', 'cp000000-0000-0000-0000-00000000002', 'TEXT', 'Hello, I need help.', NULL, NULL, datetime('now'), datetime('now')),
    ('cm000000-0000-0000-0000-00000000002', 'cr000000-0000-0000-0000-00000000001', 'cp000000-0000-0000-0000-00000000001', 'TEXT', 'Hi, how can I assist you?', NULL, NULL, datetime('now'), datetime('now'));
