import { server } from "@portfolio/testing-msw";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
    server.resetHandlers();
    cleanup();
    vi.clearAllMocks();
});

afterAll(() => {
    server.close();
});
