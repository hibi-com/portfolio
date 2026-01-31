import { Hono } from "hono";
import { beforeEach, describe, expect, test, vi } from "vitest";

const mockAuthenticate = vi.fn();
const mockUploadPortfolioImage = vi.fn();

vi.mock("../middleware/auth", () => ({
    authenticate: mockAuthenticate,
}));

vi.mock("./portfolios", () => ({
    getPortfolios: vi.fn((c) => c.json([])),
    getPortfolioBySlug: vi.fn((c) => c.json({})),
    uploadPortfolioImage: mockUploadPortfolioImage,
}));

vi.mock("./posts", () => ({
    getPosts: vi.fn((c) => c.json([])),
    getPostBySlug: vi.fn((c) => c.json({})),
}));

describe("REST Router Authentication", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("POST /portfolios/:portfolioId/images", () => {
        test("should return 401 when user is not authenticated", async () => {
            mockAuthenticate.mockResolvedValue(null);

            const { restRouter } = await import("./index");
            const app = new Hono();
            app.route("/api", restRouter);

            const response = await app.request("/api/portfolios/test-portfolio-id/images", {
                method: "POST",
                body: new FormData(),
            });

            expect(response.status).toBe(401);
            const data = await response.json();
            expect(data).toEqual({ error: "Unauthorized", code: "AUTH_REQUIRED" });
            expect(mockUploadPortfolioImage).not.toHaveBeenCalled();
        });

        test("should call uploadPortfolioImage when user is authenticated", async () => {
            mockAuthenticate.mockResolvedValue({ userId: "user-123" });
            mockUploadPortfolioImage.mockImplementation((c) => c.json({ success: true }));

            const { restRouter } = await import("./index");
            const app = new Hono();
            app.route("/api", restRouter);

            const response = await app.request("/api/portfolios/test-portfolio-id/images", {
                method: "POST",
                body: new FormData(),
            });

            expect(response.status).toBe(200);
            expect(mockUploadPortfolioImage).toHaveBeenCalled();
        });
    });

    describe("GET endpoints (public)", () => {
        test("GET /posts should not require authentication", async () => {
            const { restRouter } = await import("./index");
            const app = new Hono();
            app.route("/api", restRouter);

            const response = await app.request("/api/posts");

            expect(response.status).toBe(200);
            expect(mockAuthenticate).not.toHaveBeenCalled();
        });

        test("GET /portfolios should not require authentication", async () => {
            const { restRouter } = await import("./index");
            const app = new Hono();
            app.route("/api", restRouter);

            const response = await app.request("/api/portfolios");

            expect(response.status).toBe(200);
            expect(mockAuthenticate).not.toHaveBeenCalled();
        });
    });
});
