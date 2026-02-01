import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Input } from "./Input";

describe("Input Component", () => {
    test("should render input with placeholder", () => {
        render(<Input placeholder="Enter text" />);

        const input = screen.getByPlaceholderText("Enter text");
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("type", "text");
    });

    test("should render disabled input", () => {
        render(<Input placeholder="Disabled" disabled />);

        const input = screen.getByPlaceholderText("Disabled");
        expect(input).toBeDisabled();
    });

    test("should handle change events", () => {
        const handleChange = vi.fn();
        render(<Input placeholder="Type here" onChange={handleChange} />);

        const input = screen.getByPlaceholderText("Type here");
        fireEvent.change(input, { target: { value: "test" } });

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(input).toHaveValue("test");
    });

    test("should forward ref", () => {
        const ref = { current: null as HTMLInputElement | null };
        render(<Input ref={ref} placeholder="Ref test" />);

        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    test("should apply custom className", () => {
        render(<Input placeholder="Styled" className="custom-class" />);

        const input = screen.getByPlaceholderText("Styled");
        expect(input).toHaveClass("custom-class");
    });
});
