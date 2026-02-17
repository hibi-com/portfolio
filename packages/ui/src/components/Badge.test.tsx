import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Badge } from "./Badge";

describe("Badge Component", () => {
    test("should render badge with default props", () => {
        render(<Badge>Label</Badge>);

        const badge = screen.getByText("Label");
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass("bg-primary", "text-primary-foreground");
    });

    test("should render badge with variant", () => {
        render(<Badge variant="destructive">Error</Badge>);

        const badge = screen.getByText("Error");
        expect(badge).toHaveClass("bg-destructive", "text-destructive-foreground");
    });

    test("should render all variants", () => {
        const variants = ["default", "secondary", "destructive", "outline"] as const;

        variants.forEach((variant) => {
            const { unmount } = render(<Badge variant={variant}>{variant}</Badge>);
            const badge = screen.getByText(variant);
            expect(badge).toBeInTheDocument();
            unmount();
        });
    });

    test("should apply custom className", () => {
        const { container } = render(<Badge className="custom-class">Badge</Badge>);
        const badge = container.firstChild;
        expect(badge).toHaveClass("custom-class");
    });
});
