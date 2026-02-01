-- Seed data for post_images table (depends on posts)
USE portfolio;

INSERT INTO `post_images` (`id`, `post_id`, `url`)
VALUES
    ('pim00000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '/images/posts/welcome-1.jpg'),
    ('pim00000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '/images/posts/modern-web-1.jpg'),
    ('pim00000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '/images/posts/typescript-1.jpg')
ON DUPLICATE KEY UPDATE `url` = VALUES(`url`);
