import { createRouterWrapper } from "@portfolio/testing-vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Resume, { meta } from "./resume";

describe("resume route", () => {
    test("should render Resume component", () => {
        const wrapper = createRouterWrapper({ route: "/resume" });
        render(<Resume />, { wrapper });

        expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    test("should render download button", () => {
        const wrapper = createRouterWrapper({ route: "/resume" });
        render(<Resume />, { wrapper });

        const link = screen.getByText(/Download Resume/i);
        expect(link).toBeInTheDocument();
    });

    test("meta function should return correct metadata", () => {
        const result = meta({} as Parameters<typeof meta>[0]);

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        const titleItem = result?.find((item): item is { title: string } => "title" in item);
        expect(titleItem?.title).toBeDefined();
    });
});
