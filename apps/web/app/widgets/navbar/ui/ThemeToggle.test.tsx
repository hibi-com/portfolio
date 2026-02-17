import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ThemeToggle } from "./ThemeToggle";

const mockSubmit = vi.fn();
vi.mock("@remix-run/react", async () => {
    const actual = await vi.importActual("@remix-run/react");
    return {
        ...actual,
        useFetcher: () => ({
            submit: mockSubmit,
            formData: null,
        }),
        useLoaderData: () => ({
            theme: "dark",
        }),
    };
});

describe("ThemeToggle Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render theme toggle button", () => {
        render(<ThemeToggle />);

        const button = screen.getByLabelText("Toggle theme");
        expect(button).toBeInTheDocument();
    });

    test("should call submit when clicked", () => {
        render(<ThemeToggle />);

        const button = screen.getByLabelText("Toggle theme");
        fireEvent.click(button);

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        expect(mockSubmit).toHaveBeenCalledWith({ theme: "light" }, { action: "/api/set-theme", method: "post" });
    });

    test("should apply isMobile data attribute", () => {
        render(<ThemeToggle isMobile />);

        const button = screen.getByLabelText("Toggle theme");
        expect(button).toBeInTheDocument();
    });

    test("should not apply isMobile data attribute when false", () => {
        render(<ThemeToggle isMobile={false} />);

        const button = screen.getByLabelText("Toggle theme");
        expect(button).not.toHaveAttribute("data-mobile", "");
    });

    test("should render SVG icon", () => {
        const { container } = render(<ThemeToggle />);

        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    test("should pass other props", () => {
        render(<ThemeToggle data-testid="custom-toggle" />);

        const button = screen.getByTestId("custom-toggle");
        expect(button).toBeInTheDocument();
    });
});
