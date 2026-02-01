import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Link as RouterLink } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { PortfolioPreviewProps } from "../model/types";
import { PortfolioPreview } from "./PortfolioPreview";

vi.mock("@remix-run/react", async () => {
    const actual = await vi.importActual("@remix-run/react");
    return {
        ...actual,
        Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
            <RouterLink to={to} {...props}>
                {children}
            </RouterLink>
        ),
    };
});

describe("PortfolioPreview Component", () => {
    let props: PortfolioPreviewProps;

    beforeEach(() => {
        props = {
            current: false,
            data: {
                id: "1",
                title: "Test Portfolio",
                slug: "test-portfolio",
                company: "Test Company",
                date: "2024-01-01",
                current: false,
                overview: "Test overview",
                images: [
                    {
                        url: "/images/test.jpg",
                    },
                ],
            },
        };
    });

    test("should render portfolio title", () => {
        render(
            <MemoryRouter>
                <PortfolioPreview {...props} />
            </MemoryRouter>,
        );

        const title = screen.getByText("Test Portfolio");
        expect(title).toBeInTheDocument();
    });

    test("should render company name", () => {
        render(
            <MemoryRouter>
                <PortfolioPreview {...props} />
            </MemoryRouter>,
        );

        const company = screen.getByText("Test Company");
        expect(company).toBeInTheDocument();
    });

    test("should render year when not current", () => {
        render(
            <MemoryRouter>
                <PortfolioPreview {...props} />
            </MemoryRouter>,
        );

        const year = screen.getByText("2024");
        expect(year).toBeInTheDocument();
    });

    test("should not render year when current", () => {
        props.current = true;

        render(
            <MemoryRouter>
                <PortfolioPreview {...props} />
            </MemoryRouter>,
        );

        const year = screen.queryByText("2024");
        expect(year).not.toBeInTheDocument();
    });

    test("should render overview", () => {
        render(
            <MemoryRouter>
                <PortfolioPreview {...props} />
            </MemoryRouter>,
        );

        const overview = screen.getByText("Test overview");
        expect(overview).toBeInTheDocument();
    });

    test("should link to portfolio page", () => {
        render(
            <MemoryRouter>
                <PortfolioPreview {...props} />
            </MemoryRouter>,
        );

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/portfolio/test-portfolio");
    });
});
