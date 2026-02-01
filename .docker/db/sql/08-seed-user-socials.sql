-- Seed data for user_socials table
-- This script runs after database initialization

USE portfolio;

-- Constants to satisfy S1192 (no duplicated string literals)
SET @now = NOW();
SET @u1 = '00000000-0000-0000-0000-000000000001';
SET @u2 = '00000000-0000-0000-0000-000000000002';
SET @u3 = '00000000-0000-0000-0000-000000000003';
SET @u4 = '00000000-0000-0000-0000-000000000004';
SET @u5 = '00000000-0000-0000-0000-000000000005';
SET @u6 = '00000000-0000-0000-0000-000000000006';
SET @u7 = '00000000-0000-0000-0000-000000000007';
SET @u8 = '00000000-0000-0000-0000-000000000008';
SET @u9 = '00000000-0000-0000-0000-000000000009';
SET @u10 = '00000000-0000-0000-0000-000000000010';
SET @u11 = '00000000-0000-0000-0000-000000000011';
SET @u12 = '00000000-0000-0000-0000-000000000012';
SET @u13 = '00000000-0000-0000-0000-000000000013';
SET @u14 = '00000000-0000-0000-0000-000000000014';
SET @icon_github = 'github';
SET @title_github = 'GitHub';
SET @icon_twitter = 'twitter';
SET @title_twitter = 'Twitter';
SET @icon_linkedin = 'linkedin';
SET @title_linkedin = 'LinkedIn';
SET @icon_dribbble = 'dribbble';
SET @title_dribbble = 'Dribbble';

-- Insert sample user social data (20 social links)
INSERT INTO `user_socials` (`id`, `user_id`, `icon`, `title`, `url`, `created_at`, `updated_at`)
VALUES
    (
        '50000000-0000-0000-0000-000000000001',
        @u1,
        @icon_github,
        @title_github,
        'https://github.com/username',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000002',
        @u1,
        @icon_twitter,
        @title_twitter,
        'https://twitter.com/username',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000003',
        @u1,
        @icon_linkedin,
        @title_linkedin,
        'https://linkedin.com/in/username',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000004',
        @u2,
        @icon_github,
        @title_github,
        'https://github.com/alice',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000005',
        @u2,
        @icon_linkedin,
        @title_linkedin,
        'https://linkedin.com/in/alice',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000006',
        @u3,
        @icon_github,
        @title_github,
        'https://github.com/bob',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000007',
        @u3,
        @icon_twitter,
        @title_twitter,
        'https://twitter.com/bob',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000008',
        @u4,
        @icon_github,
        @title_github,
        'https://github.com/carol',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000009',
        @u5,
        @icon_linkedin,
        @title_linkedin,
        'https://linkedin.com/in/david',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000010',
        @u6,
        @icon_github,
        @title_github,
        'https://github.com/eva',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000011',
        @u6,
        @icon_dribbble,
        @title_dribbble,
        'https://dribbble.com/eva',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000012',
        @u7,
        @icon_github,
        @title_github,
        'https://github.com/frank',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000013',
        @u8,
        @icon_linkedin,
        @title_linkedin,
        'https://linkedin.com/in/grace',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000014',
        @u9,
        @icon_github,
        @title_github,
        'https://github.com/henry',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000015',
        @u10,
        @icon_github,
        @title_github,
        'https://github.com/ivy',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000016',
        @u10,
        @icon_linkedin,
        @title_linkedin,
        'https://linkedin.com/in/ivy',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000017',
        @u11,
        @icon_github,
        @title_github,
        'https://github.com/jack',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000018',
        @u12,
        @icon_github,
        @title_github,
        'https://github.com/kate',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000019',
        @u13,
        @icon_linkedin,
        @title_linkedin,
        'https://linkedin.com/in/liam',
        @now,
        @now
    ),
    (
        '50000000-0000-0000-0000-000000000020',
        @u14,
        @icon_github,
        @title_github,
        'https://github.com/mia',
        @now,
        @now
    )
ON DUPLICATE KEY UPDATE `updated_at` = NOW();
