import type { HttpHandler } from "msw";
import { HttpResponse, http } from "msw";
import type { Portfolio, Post } from "~/types";

const API_URL = process.env.API_URL || "http://localhost:8787";

const mockPosts: Post[] = [
    {
        id: "1",
        title: "Test Post 1",
        slug: "test-post-1",
        date: new Date("2024-01-01").toISOString(),
        description: "Test description",
        content: "<p>Test content</p>",
        imageTemp: "test-image.jpg",
        sticky: false,
        intro: "Test intro",
        tags: ["test", "blog"],
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date("2024-01-01").toISOString(),
    },
];

const mockPortfolios: Portfolio[] = [
    {
        id: "1",
        title: "Test Portfolio 1",
        slug: "test-portfolio-1",
        company: "Test Company",
        date: new Date("2024-01-01").toISOString(),
        current: true,
        overview: "Test overview",
        thumbnailTemp: "test-thumbnail.jpg",
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date("2024-01-01").toISOString(),
    },
];

export const restHandlers: HttpHandler[] = [
    http.get(`${API_URL}/api/posts`, () => {
        return HttpResponse.json(mockPosts);
    }),

    http.get(`${API_URL}/api/post/:slug`, ({ params }) => {
        const slug = params.slug as string;
        const post = mockPosts.find((p) => p.slug === slug);
        if (!post) {
            return HttpResponse.json({ error: "Post not found" }, { status: 404 });
        }
        return HttpResponse.json(post);
    }),

    http.get(`${API_URL}/api/portfolios`, () => {
        return HttpResponse.json(mockPortfolios);
    }),

    http.get(`${API_URL}/api/portfolio/:slug`, ({ params }) => {
        const slug = params.slug as string;
        const portfolio = mockPortfolios.find((p) => p.slug === slug);
        if (!portfolio) {
            return HttpResponse.json({ error: "Portfolio not found" }, { status: 404 });
        }
        return HttpResponse.json(portfolio);
    }),
];
