import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import "dotenv/config";
import "./env";
import "./mocks";
import type { ReactNode } from "react";
import { afterEach, vi } from "vitest";

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

interface LinkProps {
    to: string;
    children: ReactNode;
    [key: string]: unknown;
}

vi.mock("@remix-run/react", async () => {
    const actual = await vi.importActual("@remix-run/react");
    const { Link: RouterLink } = await import("react-router");
    const React = await import("react");

    return {
        ...actual,
        Link: ({ to, children, ...props }: LinkProps) => React.createElement(RouterLink, { to, ...props }, children),
    };
});
