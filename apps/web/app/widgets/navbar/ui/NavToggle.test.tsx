import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { NavToggle } from "./NavToggle";

describe("NavToggle Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render nav toggle button", () => {
        render(<NavToggle menuOpen={false} />);

        const button = screen.getByLabelText("Menu");
        expect(button).toBeInTheDocument();
    });

    test("should have aria-expanded false when menu is closed", () => {
        render(<NavToggle menuOpen={false} />);

        const button = screen.getByLabelText("Menu");
        expect(button).toHaveAttribute("aria-expanded", "false");
    });

    test("should have aria-expanded true when menu is open", () => {
        render(<NavToggle menuOpen={true} />);

        const button = screen.getByLabelText("Menu");
        expect(button).toHaveAttribute("aria-expanded", "true");
    });

    test("should render menu icon", () => {
        const { container } = render(<NavToggle menuOpen={false} />);

        const menuIcon = container.querySelector('[data-menu="true"]');
        expect(menuIcon).toBeInTheDocument();
    });

    test("should render close icon", () => {
        const { container } = render(<NavToggle menuOpen={false} />);

        const closeIcon = container.querySelector('[data-close="true"]');
        expect(closeIcon).toBeInTheDocument();
    });

    test("should pass onClick handler", () => {
        const handleClick = vi.fn();
        render(<NavToggle menuOpen={false} onClick={handleClick} />);

        const button = screen.getByLabelText("Menu");
        button.click();

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test("should pass other props", () => {
        render(<NavToggle menuOpen={false} data-testid="custom-toggle" />);

        const button = screen.getByTestId("custom-toggle");
        expect(button).toBeInTheDocument();
    });
});
