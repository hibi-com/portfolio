import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea Component", () => {
    test("should render textarea with placeholder", () => {
        render(<Textarea placeholder="Enter text" />);

        const textarea = screen.getByPlaceholderText("Enter text");
        expect(textarea).toBeInTheDocument();
        expect(textarea.tagName).toBe("TEXTAREA");
    });

    test("should render disabled textarea", () => {
        render(<Textarea placeholder="Disabled" disabled />);

        const textarea = screen.getByPlaceholderText("Disabled");
        expect(textarea).toBeDisabled();
    });

    test("should handle change events", () => {
        const handleChange = vi.fn();
        render(<Textarea placeholder="Type here" onChange={handleChange} />);

        const textarea = screen.getByPlaceholderText("Type here");
        fireEvent.change(textarea, { target: { value: "hello" } });

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(textarea).toHaveValue("hello");
    });

    test("should forward ref", () => {
        const ref = { current: null as HTMLTextAreaElement | null };
        render(<Textarea ref={ref} placeholder="Ref test" />);

        expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    test("should apply custom className", () => {
        render(<Textarea placeholder="Styled" className="custom-class" />);

        const textarea = screen.getByPlaceholderText("Styled");
        expect(textarea).toHaveClass("custom-class");
    });
});
