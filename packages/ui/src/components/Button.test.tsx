import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Button } from "./Button";

describe("Button Component", () => {
    test("should render button with default props", () => {
        render(<Button>Click me</Button>);

        const button = screen.getByRole("button", { name: "Click me" });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass("bg-primary", "text-primary-foreground");
    });

    test("should render button with variant", () => {
        render(<Button variant="destructive">Delete</Button>);

        const button = screen.getByRole("button", { name: "Delete" });
        expect(button).toHaveClass("bg-destructive", "text-destructive-foreground");
    });

    test("should render button with size", () => {
        render(<Button size="lg">Large Button</Button>);

        const button = screen.getByRole("button", { name: "Large Button" });
        expect(button).toHaveClass("h-11", "rounded-md", "px-8");
    });

    test("should render disabled button", () => {
        render(<Button disabled>Disabled</Button>);

        const button = screen.getByRole("button", { name: "Disabled" });
        expect(button).toBeDisabled();
        expect(button).toHaveClass("disabled:pointer-events-none", "disabled:opacity-50");
    });

    test("should handle click events", () => {
        const handleClick = vi.fn();

        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByRole("button", { name: "Click me" });
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test("should not call onClick when disabled", () => {
        const handleClick = vi.fn();

        render(
            <Button disabled onClick={handleClick}>
                Disabled
            </Button>,
        );

        const button = screen.getByRole("button", { name: "Disabled" });
        fireEvent.click(button);

        expect(handleClick).not.toHaveBeenCalled();
    });

    test("should render all variants", () => {
        const variants = ["default", "destructive", "outline", "secondary", "ghost", "link"] as const;

        variants.forEach((variant) => {
            const { unmount } = render(<Button variant={variant}>{variant}</Button>);
            const button = screen.getByRole("button", { name: variant });
            expect(button).toBeInTheDocument();
            unmount();
        });
    });

    test("should render all sizes", () => {
        const sizes = ["default", "sm", "lg", "icon"] as const;

        sizes.forEach((size) => {
            const { unmount } = render(<Button size={size}>{size}</Button>);
            const button = screen.getByRole("button", { name: size });
            expect(button).toBeInTheDocument();
            unmount();
        });
    });
});
