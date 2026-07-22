import { describe, expect, test, vi } from "vitest";
import { initAuth } from "./index";

vi.mock("@portfolio/db", () => ({
    createPrismaClient: vi.fn(() => ({
        $disconnect: vi.fn(),
    })),
}));

vi.mock("better-auth", () => ({
    betterAuth: vi.fn((_config) => ({
        api: {
            getSession: vi.fn(),
        },
        $Infer: {
            Session: {},
        },
    })),
}));

vi.mock("better-auth/adapters/prisma", () => ({
    prismaAdapter: vi.fn((_prisma, options) => ({
        provider: options.provider,
    })),
}));

vi.mock("better-auth/plugins", () => ({
    oAuthProxy: vi.fn((options) => ({
        productionURL: options.productionURL,
    })),
}));

describe("initAuth", () => {
    test("should initialize auth with Google SSO", () => {
        const auth = initAuth({
            baseUrl: "http://localhost:3000",
            productionUrl: "http://localhost:3000",
            secret: "test-secret",
            googleClientId: "test-google-client-id",
            googleClientSecret: "test-google-client-secret",
        });

        expect(auth).toBeDefined();
    });

    test("should initialize auth with databaseUrl", () => {
        const auth = initAuth({
            baseUrl: "http://localhost:3000",
            productionUrl: "http://localhost:3000",
            secret: "test-secret",
            googleClientId: "test-google-client-id",
            googleClientSecret: "test-google-client-secret",
            databaseUrl: "file:./portfolio.db",
        });

        expect(auth).toBeDefined();
    });

    test("should initialize auth with extra plugins", () => {
        const extraPlugin = {
            id: "test-plugin",
            install: vi.fn(),
        };

        const auth = initAuth({
            baseUrl: "http://localhost:3000",
            productionUrl: "http://localhost:3000",
            secret: "test-secret",
            googleClientId: "test-google-client-id",
            googleClientSecret: "test-google-client-secret",
            extraPlugins: [extraPlugin],
        });

        expect(auth).toBeDefined();
    });
});
