import { createRouterWrapper } from "@portfolio/testing-vitest";
import type { MetaArgs } from "@remix-run/node";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Index, { meta } from "./_index";

vi.mock("~/routes/api.qualities", () => ({
    getQuote: vi.fn((_value?: string) => {
        const quotes = ["A problem solver 🧩", "A creative thinker 🤔", "A team player 🤝"];
        return quotes[0];
    }),
}));

describe("_index route", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render Index component", () => {
        const wrapper = createRouterWrapper({ route: "/" });
        render(<Index />, { wrapper });

        expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    test("should render hero section", () => {
        const wrapper = createRouterWrapper({ route: "/" });
        render(<Index />, { wrapper });

        expect(screen.getByText(/A Software Engineer/i)).toBeInTheDocument();
    });

    test("should render button", () => {
        const wrapper = createRouterWrapper({ route: "/" });
        render(<Index />, { wrapper });

        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThan(0);
    });

    test("meta function should return correct metadata", () => {
        const result = meta({
            data: undefined,
            params: {},
            location: { pathname: "/", search: "", hash: "", state: null, key: "" },
            matches: [],
        } as MetaArgs);

        expect(result).toBeInstanceOf(Array);
        if (result) {
            expect(result.some((item) => "title" in item && item.title)).toBe(true);
        }
    });

    test("meta function should handle canonical URL", () => {
        const result = meta({
            data: { canonical: "https://example.com" },
            params: {},
            location: { pathname: "/", search: "", hash: "", state: null, key: "" },
            matches: [],
        } as MetaArgs);

        if (result) {
            expect(result.some((item) => "tagName" in item && item.tagName === "link")).toBe(true);
        }
    });
});
