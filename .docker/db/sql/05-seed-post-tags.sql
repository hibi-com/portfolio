-- Seed data for post_tags table (junction table)
-- This script runs after database initialization

USE portfolio;

-- Post ID constants (avoids S1192 duplicated literal)
SET @p1 = '20000000-0000-0000-0000-000000000001';
SET @p2 = '20000000-0000-0000-0000-000000000002';
SET @p3 = '20000000-0000-0000-0000-000000000003';
SET @p4 = '20000000-0000-0000-0000-000000000004';
SET @p5 = '20000000-0000-0000-0000-000000000005';
SET @p6 = '20000000-0000-0000-0000-000000000006';
SET @p7 = '20000000-0000-0000-0000-000000000007';
SET @p8 = '20000000-0000-0000-0000-000000000008';
SET @p9 = '20000000-0000-0000-0000-000000000009';
SET @p10 = '20000000-0000-0000-0000-000000000010';
SET @p11 = '20000000-0000-0000-0000-000000000011';
SET @p12 = '20000000-0000-0000-0000-000000000012';
SET @p13 = '20000000-0000-0000-0000-000000000013';
SET @p14 = '20000000-0000-0000-0000-000000000014';
SET @p15 = '20000000-0000-0000-0000-000000000015';
SET @p16 = '20000000-0000-0000-0000-000000000016';
SET @p17 = '20000000-0000-0000-0000-000000000017';
SET @p18 = '20000000-0000-0000-0000-000000000018';
SET @p19 = '20000000-0000-0000-0000-000000000019';
SET @p20 = '20000000-0000-0000-0000-000000000020';
-- Tag ID constants
SET @t1 = '10000000-0000-0000-0000-000000000001';
SET @t2 = '10000000-0000-0000-0000-000000000002';
SET @t3 = '10000000-0000-0000-0000-000000000003';
SET @t4 = '10000000-0000-0000-0000-000000000004';
SET @t5 = '10000000-0000-0000-0000-000000000005';
SET @t6 = '10000000-0000-0000-0000-000000000006';
SET @t7 = '10000000-0000-0000-0000-000000000007';
SET @t8 = '10000000-0000-0000-0000-000000000008';
SET @t9 = '10000000-0000-0000-0000-000000000009';
SET @t10 = '10000000-0000-0000-0000-000000000010';
SET @t11 = '10000000-0000-0000-0000-000000000011';
SET @t12 = '10000000-0000-0000-0000-000000000012';
SET @t13 = '10000000-0000-0000-0000-000000000013';
SET @t14 = '10000000-0000-0000-0000-000000000014';
SET @t15 = '10000000-0000-0000-0000-000000000015';
SET @t16 = '10000000-0000-0000-0000-000000000016';
SET @t17 = '10000000-0000-0000-0000-000000000017';
SET @t18 = '10000000-0000-0000-0000-000000000018';
SET @t19 = '10000000-0000-0000-0000-000000000019';
SET @t20 = '10000000-0000-0000-0000-000000000020';

-- Insert sample post-tag relationships (multiple tags per post)
INSERT INTO `post_tags` (`post_id`, `tag_id`)
VALUES
    -- Post 1: Welcome (TypeScript, Web Development)
    (@p1, @t1),
    (@p1, @t5),
    -- Post 2: Modern Web App (TypeScript, React, Node.js, Web Development)
    (@p2, @t1),
    (@p2, @t2),
    (@p2, @t3),
    (@p2, @t5),
    -- Post 3: TypeScript (TypeScript, JavaScript)
    (@p3, @t1),
    (@p3, @t6),
    -- Post 4: React Performance (React, JavaScript, Performance)
    (@p4, @t2),
    (@p4, @t6),
    (@p4, @t17),
    -- Post 5: Database (Database, Web Development)
    (@p5, @t4),
    (@p5, @t5),
    -- Post 6: Docker (Docker, CI/CD)
    (@p6, @t8),
    (@p6, @t14),
    -- Post 7: REST API (REST API, Web Development)
    (@p7, @t12),
    (@p7, @t5),
    -- Post 8: GraphQL vs REST (GraphQL, REST API)
    (@p8, @t11),
    (@p8, @t12),
    -- Post 9: Microservices (Microservices, Docker, Kubernetes)
    (@p9, @t13),
    (@p9, @t8),
    (@p9, @t9),
    -- Post 10: CI/CD (CI/CD, Docker)
    (@p10, @t14),
    (@p10, @t8),
    -- Post 11: Testing (Testing, Web Development)
    (@p11, @t15),
    (@p11, @t5),
    -- Post 12: Security (Security, Web Development)
    (@p12, @t16),
    (@p12, @t5),
    -- Post 13: Performance (Performance, Web Development)
    (@p13, @t17),
    (@p13, @t5),
    -- Post 14: Mobile (Mobile, Web Development)
    (@p14, @t18),
    (@p14, @t5),
    -- Post 15: Machine Learning (Machine Learning, Python)
    (@p15, @t19),
    (@p15, @t7),
    -- Post 16: Blockchain (Blockchain, Security)
    (@p16, @t20),
    (@p16, @t16),
    -- Post 17: AWS (AWS, Cloud)
    (@p17, @t10),
    -- Post 18: Kubernetes (Kubernetes, Docker, Microservices)
    (@p18, @t9),
    (@p18, @t8),
    (@p18, @t13),
    -- Post 19: Python (Python, Web Development)
    (@p19, @t7),
    (@p19, @t5),
    -- Post 20: JavaScript (JavaScript, Web Development)
    (@p20, @t6),
    (@p20, @t5)
ON DUPLICATE KEY UPDATE `post_id` = VALUES(`post_id`);
