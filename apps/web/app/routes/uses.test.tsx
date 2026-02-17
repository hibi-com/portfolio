import { createRouterWrapper } from "@portfolio/testing-vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Uses, { meta } from "./uses";

describe("uses route", () => {
    test("should render Uses component", () => {
        const wrapper = createRouterWrapper({ route: "/uses" });
        render(<Uses />, { wrapper });

        expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    test("should render hero section", () => {
        const wrapper = createRouterWrapper({ route: "/uses" });
        render(<Uses />, { wrapper });

        expect(screen.getByText(/If you're curious/i)).toBeInTheDocument();
    });

    test("meta function should return correct metadata", () => {
        const result = meta({} as Parameters<typeof meta>[0]);

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        const titleItem = result?.find((item): item is { title: string } => "title" in item);
        expect(titleItem?.title).toBeDefined();
    });
});
