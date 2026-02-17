import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Label } from "./Label";

describe("Label Component", () => {
    test("should render label with text", () => {
        render(<Label>Field label</Label>);

        const label = screen.getByText("Field label");
        expect(label).toBeInTheDocument();
        expect(label.tagName).toBe("LABEL");
    });

    test("should associate with input via htmlFor", () => {
        render(
            <>
                <Label htmlFor="test-input">Test</Label>
                <input id="test-input" />
            </>,
        );

        const label = screen.getByText("Test");
        const input = screen.getByRole("textbox");
        expect(label).toHaveAttribute("for", "test-input");
        expect(input).toHaveAttribute("id", "test-input");
    });

    test("should apply custom className", () => {
        render(<Label className="custom-class">Label</Label>);

        const label = screen.getByText("Label");
        expect(label).toHaveClass("custom-class");
    });
});
