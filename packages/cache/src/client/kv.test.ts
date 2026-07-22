import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createKvClient, resetKvClient } from "./kv";

function createMockKv(): KVNamespace {
    return {
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        list: vi.fn(),
        getWithMetadata: vi.fn(),
    } as unknown as KVNamespace;
}

describe("createKvClient", () => {
    beforeEach(() => {
        resetKvClient();
    });

    afterEach(() => {
        resetKvClient();
    });

    test("should throw error when kv is not provided", () => {
        expect(() => {
            createKvClient();
        }).toThrow("KVNamespace is required");
    });

    test("should create KV client with kv binding", () => {
        const kv = createMockKv();

        const client = createKvClient({ kv });

        expect(client).toBe(kv);
        expect(typeof client.get).toBe("function");
        expect(typeof client.put).toBe("function");
    });

    test("should return same instance on multiple calls (singleton)", () => {
        const kv = createMockKv();

        const client1 = createKvClient({ kv });
        const client2 = createKvClient({ kv: createMockKv() });

        expect(client1).toBe(client2);
        expect(client1).toBe(kv);
    });
});
