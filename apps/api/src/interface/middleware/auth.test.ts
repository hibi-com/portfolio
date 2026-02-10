import type { Context } from "hono";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { authenticate } from "./auth";

const mockGetSession = vi.fn();

vi.mock("@portfolio/auth", () => ({
    initAuth: vi.fn(() => ({
        api: {
            getSession: mockGetSession,
        },
    })),
}));

describe("authenticate", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should return null when BETTER_AUTH_SECRET is not set", async () => {
        const mockContext = {
            env: {
                DATABASE_URL: "mysql://localhost:3306/test",
            },
            req: {
                raw: {
                    headers: new Headers(),
                },
            },
        } as unknown as Context;

        const result = await authenticate(mockContext);

        expect(result).toBeNull();
        expect(mockGetSession).not.toHaveBeenCalled();
    });

    test("should return null when no session is available", async () => {
        mockGetSession.mockResolvedValue(null);

        const mockContext = {
            env: {
                DATABASE_URL: "mysql://localhost:3306/test",
                BETTER_AUTH_SECRET: "test-secret",
                BETTER_AUTH_URL: "http://localhost:8787",
                GOOGLE_CLIENT_ID: "test-client-id",
                GOOGLE_CLIENT_SECRET: "test-client-secret",
            },
            req: {
                raw: {
                    headers: new Headers(),
                },
            },
        } as unknown as Context;

        const result = await authenticate(mockContext);

        expect(result).toBeNull();
        expect(mockGetSession).toHaveBeenCalledWith({
            headers: expect.any(Headers),
        });
    });

    test("should return userId when session is available", async () => {
        mockGetSession.mockResolvedValue({
            user: {
                id: "user-123",
                email: "test@example.com",
            },
            session: {
                id: "session-123",
            },
        });

        const mockContext = {
            env: {
                DATABASE_URL: "mysql://localhost:3306/test",
                BETTER_AUTH_SECRET: "test-secret",
                BETTER_AUTH_URL: "http://localhost:8787",
                GOOGLE_CLIENT_ID: "test-client-id",
                GOOGLE_CLIENT_SECRET: "test-client-secret",
            },
            req: {
                raw: {
                    headers: new Headers(),
                },
            },
        } as unknown as Context;

        const result = await authenticate(mockContext);

        expect(result).toEqual({ userId: "user-123" });
        expect(mockGetSession).toHaveBeenCalledWith({
            headers: expect.any(Headers),
        });
    });

    test("should use default baseUrl when BETTER_AUTH_URL is not set", async () => {
        mockGetSession.mockResolvedValue(null);

        const mockContext = {
            env: {
                DATABASE_URL: "mysql://localhost:3306/test",
                BETTER_AUTH_SECRET: "test-secret",
                GOOGLE_CLIENT_ID: "test-client-id",
                GOOGLE_CLIENT_SECRET: "test-client-secret",
            },
            req: {
                raw: {
                    headers: new Headers(),
                },
            },
        } as unknown as Context;

        await authenticate(mockContext);

        expect(mockGetSession).toHaveBeenCalled();
    });
});
