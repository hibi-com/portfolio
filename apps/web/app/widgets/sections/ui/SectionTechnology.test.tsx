import { fireEvent, render, screen } from "@testing-library/react";
import { SectionTechnology } from "./SectionTechnology";

describe("SectionTechnology Component", () => {
    test("should render technology section", () => {
        render(<SectionTechnology />);

        expect(screen.getByText(/Technology/)).toBeInTheDocument();
    });

    test("should render heading with emoji", () => {
        render(<SectionTechnology />);

        const heading = screen.getByRole("heading", { level: 2 });
        expect(heading).toHaveTextContent("Technology 🧰");
    });

    test("should render technology buttons", () => {
        const { container } = render(<SectionTechnology />);

        const buttons = container.querySelectorAll("button");
        expect(buttons.length).toBeGreaterThan(0);
    });

    test("should show default description initially", () => {
        const { container } = render(<SectionTechnology />);

        const blockquote = container.querySelector("blockquote");
        expect(blockquote).toBeInTheDocument();
    });

    test("should update description when button is clicked", () => {
        const { container } = render(<SectionTechnology />);

        const buttons = container.querySelectorAll("button");
        if (buttons.length > 0) {
            const firstButton = buttons[0];
            if (!firstButton) return;
            const initialDescription = container.querySelector("blockquote")?.innerHTML;

            fireEvent.click(firstButton);

            const updatedDescription = container.querySelector("blockquote")?.innerHTML;
            expect(updatedDescription).not.toBe(initialDescription);
        }
    });

    test("should toggle button active state", () => {
        const { container } = render(<SectionTechnology />);

        const buttons = container.querySelectorAll("button");
        if (buttons.length > 0) {
            const firstButton = buttons[0];
            if (!firstButton) return;

            expect(firstButton).not.toHaveClass("active");

            fireEvent.click(firstButton);
            expect(firstButton).toHaveClass("active");

            fireEvent.click(firstButton);
            expect(firstButton).not.toHaveClass("active");
        }
    });

    test("should render description blockquote", () => {
        const { container } = render(<SectionTechnology />);

        const blockquote = container.querySelector("blockquote");
        expect(blockquote).toBeInTheDocument();
    });
});
