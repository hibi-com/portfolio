import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

interface MockPrismaClient {
    _adapter: unknown;
    $connect: ReturnType<typeof vi.fn>;
    $disconnect: ReturnType<typeof vi.fn>;
}

const mockPrismaCtor = vi.fn().mockImplementation((opts: { adapter?: unknown }) => ({
    _adapter: opts?.adapter,
    $connect: vi.fn(),
    $disconnect: vi.fn(),
}));

vi.mock("../../generated/prisma/client.js", () => ({
    PrismaClient: mockPrismaCtor,
}));

vi.mock("@prisma/adapter-d1", () => ({
    PrismaD1: vi.fn().mockImplementation((d1: unknown) => ({ _d1: d1 })),
}));

vi.mock("@prisma/adapter-libsql", () => ({
    PrismaLibSql: vi.fn().mockImplementation((opts: { url: string }) => ({ _url: opts.url })),
}));

const testDbUrl = (path: string) => `file:./${path}`;

describe("createPrismaClient", () => {
    let originalEnv: string | undefined;

    beforeEach(() => {
        originalEnv = process.env.DATABASE_URL;
    });

    afterEach(() => {
        if (originalEnv === undefined) {
            delete process.env.DATABASE_URL;
        } else {
            process.env.DATABASE_URL = originalEnv;
        }
        vi.clearAllMocks();
    });

    describe("singleton behavior", () => {
        beforeEach(() => {
            vi.resetModules();
        });

        test("should create a new PrismaClient instance", async () => {
            const { createPrismaClient } = await import("./d1.js");

            const client = createPrismaClient({
                databaseUrl: "file:./test.db",
            }) as unknown as MockPrismaClient;

            expect(client).toBeDefined();
            expect(client._adapter).toBeDefined();
        });

        test("should return the same instance on subsequent calls (singleton)", async () => {
            const { createPrismaClient } = await import("./d1.js");

            const client1 = createPrismaClient({ databaseUrl: "file:./test.db" });
            const client2 = createPrismaClient({ databaseUrl: testDbUrl("other.db") });

            expect(client1).toBe(client2);
        });

        test("should use provided databaseUrl option", async () => {
            const { createPrismaClient } = await import("./d1.js");
            const testUrl = testDbUrl("custom.db");

            const client = createPrismaClient({ databaseUrl: testUrl }) as unknown as MockPrismaClient;

            expect(client._adapter).toBeDefined();
            expect((client._adapter as { _url?: string })._url).toBe(testUrl);
        });

        test("should use d1 binding when provided", async () => {
            const { createPrismaClient } = await import("./d1.js");
            const d1 = { prepare: vi.fn() } as unknown as D1Database;

            const client = createPrismaClient({ d1 }) as unknown as MockPrismaClient;

            expect(client._adapter).toBeDefined();
            expect((client._adapter as { _d1?: unknown })._d1).toBe(d1);
        });
    });

    describe("environment variable fallback", () => {
        beforeEach(() => {
            vi.resetModules();
        });

        test("should fallback to DATABASE_URL environment variable when no url provided", async () => {
            process.env.DATABASE_URL = "file:./env.db";
            const { createPrismaClient } = await import("./d1.js");

            const client = createPrismaClient() as unknown as MockPrismaClient;

            expect((client._adapter as { _url?: string })._url).toBe("file:./env.db");
        });

        test("should throw when neither option nor env var is provided", async () => {
            delete process.env.DATABASE_URL;
            const { createPrismaClient } = await import("./d1.js");

            expect(() => createPrismaClient()).toThrow("DATABASE_URL");
        });

        test("should accept empty options object", async () => {
            process.env.DATABASE_URL = "file:./default.db";
            const { createPrismaClient } = await import("./d1.js");

            const client = createPrismaClient({}) as unknown as MockPrismaClient;

            expect(client).toBeDefined();
            expect((client._adapter as { _url?: string })._url).toBe("file:./default.db");
        });

        test("should accept http libSQL URL", async () => {
            const { createPrismaClient } = await import("./d1.js");

            const client = createPrismaClient({
                databaseUrl: "http://127.0.0.1:8081",
            }) as unknown as MockPrismaClient;

            expect((client._adapter as { _url?: string })._url).toBe("http://127.0.0.1:8081");
        });

        test("should accept libsql URL", async () => {
            const { createPrismaClient } = await import("./d1.js");

            const client = createPrismaClient({
                databaseUrl: "libsql://example.turso.io",
            }) as unknown as MockPrismaClient;

            expect((client._adapter as { _url?: string })._url).toBe("libsql://example.turso.io");
        });
    });

    describe("singleton caching", () => {
        test("should return cached instance when called multiple times", async () => {
            vi.resetModules();
            const { createPrismaClient } = await import("./d1.js");

            const firstCall = createPrismaClient({ databaseUrl: "file:./first.db" });
            const secondCall = createPrismaClient({
                databaseUrl: testDbUrl("second.db"),
            });
            const thirdCall = createPrismaClient();

            expect(firstCall).toBe(secondCall);
            expect(secondCall).toBe(thirdCall);
        });
    });
});
