import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Link as RouterLink } from "react-router";
import PortfolioSlug, { meta } from "./portfolio_.$slug";

vi.mock("~/routes/api.portfolio.$slug", () => ({
    loader: vi.fn(),
}));

vi.mock("@remix-run/react", async () => {
    const actual = await vi.importActual("@remix-run/react");
    return {
        ...actual,
        Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
            <RouterLink to={to} {...props}>
                {children}
            </RouterLink>
        ),
        useLoaderData: vi.fn(() => ({
            title: "Test Portfolio",
            company: "Test Company",
            intro: "Test intro",
            content: {
                html: "<p>Test content</p>",
            },
            images: [{ url: "/test.jpg" }],
        })),
    };
});

describe("portfolio_.$slug route", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render Portfolio_Slug component", () => {
        render(
            <MemoryRouter initialEntries={["/portfolio/test-portfolio"]}>
                <PortfolioSlug />
            </MemoryRouter>,
        );

        expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    test("should render portfolio title", () => {
        render(
            <MemoryRouter initialEntries={["/portfolio/test-portfolio"]}>
                <PortfolioSlug />
            </MemoryRouter>,
        );

        expect(screen.getByText("Test Portfolio")).toBeInTheDocument();
    });

    test("meta function should return correct metadata", () => {
        const result = meta({
            data: { title: "Test Portfolio", intro: "Test intro" },
        } as Parameters<typeof meta>[0]);

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        const titleItem = result?.find((item): item is { title: string } => "title" in item);
        expect(titleItem?.title).toBe("Test Portfolio");
    });

    test("meta function should handle missing data", () => {
        const result = meta({ data: undefined } as Parameters<typeof meta>[0]);

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
    });
});
