import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Link as RouterLink } from "react-router";
import Portfolio, { meta } from "./portfolio";

vi.mock("~/shared/api/portfolio", () => ({
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
        useLoaderData: vi.fn(() => [
            {
                slug: "test-portfolio",
                title: "Test Portfolio",
                company: "Test Company",
                current: true,
                date: "2023-01-01",
                images: [],
                overview: "Test overview",
                thumbnailTemp: "/test.jpg",
            },
        ]),
    };
});

describe("portfolio route", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render Portfolio component", () => {
        render(
            <MemoryRouter initialEntries={["/portfolio"]}>
                <Portfolio />
            </MemoryRouter>,
        );

        expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    test("should render hero section", () => {
        render(
            <MemoryRouter initialEntries={["/portfolio"]}>
                <Portfolio />
            </MemoryRouter>,
        );

        expect(screen.getByText(/Right now/i)).toBeInTheDocument();
    });

    test("meta function should return correct metadata", () => {
        const result = meta({} as Parameters<typeof meta>[0]);

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        const titleItem = result?.find((item): item is { title: string } => "title" in item);
        expect(titleItem?.title).toBeDefined();
    });
});
