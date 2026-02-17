import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Separator } from "./Separator";

describe("Separator Component", () => {
    test("should render horizontal separator by default", () => {
        const { container } = render(<Separator />);
        const separator = container.firstChild;
        expect(separator).toBeInTheDocument();
        expect(separator).toHaveClass("h-px", "w-full");
    });

    test("should render vertical separator", () => {
        const { container } = render(<Separator orientation="vertical" />);
        const separator = container.firstChild;
        expect(separator).toHaveClass("h-full", "w-px");
    });

    test("should apply custom className", () => {
        const { container } = render(<Separator className="custom-class" />);
        const separator = container.firstChild;
        expect(separator).toHaveClass("custom-class");
    });
});
