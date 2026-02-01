-- Seed data for portfolio_images table (depends on portfolios)
USE portfolio;

INSERT INTO `portfolio_images` (`id`, `portfolio_id`, `url`)
VALUES
    ('pi000000-0000-0000-0000-00000000001', '30000000-0000-0000-0000-000000000001', '/images/portfolios/ecommerce-1.jpg'),
    ('pi000000-0000-0000-0000-00000000002', '30000000-0000-0000-0000-000000000001', '/images/portfolios/ecommerce-2.jpg'),
    ('pi000000-0000-0000-0000-00000000003', '30000000-0000-0000-0000-000000000002', '/images/portfolios/portfolio-1.jpg')
ON DUPLICATE KEY UPDATE `url` = VALUES(`url`);
