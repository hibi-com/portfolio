import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe("API Security Headers and CORS", () => {
    let app: Hono;

    beforeEach(() => {
        vi.clearAllMocks();

        app = new Hono();

        app.use(
            "*",
            secureHeaders({
                xFrameOptions: "DENY",
                xContentTypeOptions: "nosniff",
                referrerPolicy: "strict-origin-when-cross-origin",
                xXssProtection: "1; mode=block",
            }),
        );

        app.use(
            "*",
            cors({
                origin: ["http://localhost:3000", "http://localhost:5173"],
                credentials: true,
                allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
                exposeHeaders: ["Content-Length", "X-Request-Id"],
                maxAge: 86400,
            }),
        );

        app.get("/health", (c) => c.json({ status: "ok" }));
        app.get("/api/portfolios", (c) => c.json([]));
    });

    describe("Security Headers", () => {
        test("should include X-Frame-Options: DENY header", async () => {
            const response = await app.request("/health", {
                method: "GET",
            });

            expect(response.headers.get("X-Frame-Options")).toBe("DENY");
        });

        test("should include X-Content-Type-Options: nosniff header", async () => {
            const response = await app.request("/health", {
                method: "GET",
            });

            expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
        });

        test("should include Referrer-Policy header", async () => {
            const response = await app.request("/health", {
                method: "GET",
            });

            expect(response.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
        });

        test("should include X-XSS-Protection header", async () => {
            const response = await app.request("/health", {
                method: "GET",
            });

            expect(response.headers.get("X-XSS-Protection")).toBe("1; mode=block");
        });
    });

    describe("CORS", () => {
        test("should respond to OPTIONS preflight request", async () => {
            const response = await app.request("/api/portfolios", {
                method: "OPTIONS",
                headers: {
                    Origin: "http://localhost:3000",
                    "Access-Control-Request-Method": "GET",
                },
            });

            expect(response.status).toBe(204);
        });

        test("should include Access-Control-Allow-Credentials header", async () => {
            const response = await app.request("/api/portfolios", {
                method: "OPTIONS",
                headers: {
                    Origin: "http://localhost:3000",
                    "Access-Control-Request-Method": "GET",
                },
            });

            expect(response.headers.get("Access-Control-Allow-Credentials")).toBe("true");
        });

        test("should allow configured origin", async () => {
            const response = await app.request("/health", {
                method: "GET",
                headers: {
                    Origin: "http://localhost:3000",
                },
            });

            expect(response.headers.get("Access-Control-Allow-Origin")).toBe("http://localhost:3000");
        });

        test("should reject non-configured origin", async () => {
            const response = await app.request("/health", {
                method: "GET",
                headers: {
                    Origin: "http://malicious-site.com",
                },
            });

            expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
        });
    });
});
