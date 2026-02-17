import { afterEach, vi } from "vitest";

function cleanupAfterEachTest(): void {
    vi.resetModules();
    vi.restoreAllMocks();
}

afterEach(cleanupAfterEachTest);
