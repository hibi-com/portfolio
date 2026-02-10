import type { Portfolio, Post } from "./types.js";

const BASE_DATE = "2024-01-01T00:00:00.000Z";

export const mockPosts: Post[] = [
    {
        id: "1",
        title: "Test Post 1",
        slug: "test-post-1",
        date: BASE_DATE,
        description: "Test description",
        content: "<p>Test content</p>",
        imageTemp: "test-image.jpg",
        sticky: false,
        intro: "Test intro",
        tags: ["test", "blog"],
        createdAt: BASE_DATE,
        updatedAt: BASE_DATE,
    },
];

export const mockPortfolios: Portfolio[] = [
    {
        id: "1",
        title: "Test Portfolio 1",
        slug: "test-portfolio-1",
        company: "Test Company",
        date: BASE_DATE,
        current: true,
        overview: "Test overview",
        thumbnailTemp: "test-thumbnail.jpg",
        createdAt: BASE_DATE,
        updatedAt: BASE_DATE,
    },
];
