-- Seed data for user table
-- This script runs after database initialization

USE portfolio;

-- Insert sample user data (20 users)
INSERT INTO `user` (`id`, `name`, `email`, `emailVerified`, `image`, `bio`, `createdAt`, `updatedAt`)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Portfolio User', 'user@example.com', true, NULL, 'Portfolio developer', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000002', 'Alice Johnson', 'alice@example.com', true, '/images/users/alice.jpg', 'Full-stack developer passionate about web technologies', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000003', 'Bob Smith', 'bob@example.com', true, '/images/users/bob.jpg', 'Frontend specialist with React expertise', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000004', 'Carol White', 'carol@example.com', false, NULL, 'Backend engineer focused on scalable systems', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000005', 'David Brown', 'david@example.com', true, '/images/users/david.jpg', 'DevOps engineer and cloud architect', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000006', 'Eva Davis', 'eva@example.com', true, '/images/users/eva.jpg', 'UI/UX designer and frontend developer', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000007', 'Frank Miller', 'frank@example.com', true, NULL, 'Mobile app developer specializing in React Native', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000008', 'Grace Wilson', 'grace@example.com', true, '/images/users/grace.jpg', 'Data engineer and database specialist', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000009', 'Henry Taylor', 'henry@example.com', false, NULL, 'Security engineer and penetration tester', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000010', 'Ivy Anderson', 'ivy@example.com', true, '/images/users/ivy.jpg', 'Machine learning engineer and data scientist', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000011', 'Jack Martinez', 'jack@example.com', true, '/images/users/jack.jpg', 'Game developer using Unity and C#', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000012', 'Kate Lee', 'kate@example.com', true, NULL, 'Blockchain developer and smart contract specialist', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000013', 'Liam Thompson', 'liam@example.com', true, '/images/users/liam.jpg', 'API developer and microservices architect', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000014', 'Mia Garcia', 'mia@example.com', false, NULL, 'QA engineer and test automation specialist', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000015', 'Noah Rodriguez', 'noah@example.com', true, '/images/users/noah.jpg', 'Site reliability engineer and infrastructure expert', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000016', 'Olivia Lewis', 'olivia@example.com', true, '/images/users/olivia.jpg', 'Product manager with technical background', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000017', 'Paul Walker', 'paul@example.com', true, NULL, 'Technical writer and documentation specialist', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000018', 'Quinn Hall', 'quinn@example.com', true, '/images/users/quinn.jpg', 'Cloud solutions architect and consultant', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000019', 'Rachel Young', 'rachel@example.com', true, '/images/users/rachel.jpg', 'Full-stack developer with startup experience', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000020', 'Sam King', 'sam@example.com', false, NULL, 'Open source contributor and community builder', NOW(), NOW())
ON DUPLICATE KEY UPDATE `updatedAt` = NOW();
