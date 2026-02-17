import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import "dotenv/config";
import "./env";
import "./mocks";
import { afterEach, vi } from "vitest";

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});
