import { render, screen } from "@testing-library/react";
import { SectionHardware } from "./SectionHardware";

describe("SectionHardware Component", () => {
    test("should render hardware section", () => {
        render(<SectionHardware />);

        expect(screen.getByText(/Hardware/)).toBeInTheDocument();
    });

    test("should render heading with emoji", () => {
        render(<SectionHardware />);

        const heading = screen.getByRole("heading", { level: 2 });
        expect(heading).toHaveTextContent("Hardware 💻");
    });

    test("should render description", () => {
        render(<SectionHardware />);

        expect(screen.getByText(/Mac over the last 10\+ years/)).toBeInTheDocument();
    });

    test("should render hardware list items", () => {
        render(<SectionHardware />);

        expect(screen.getByText(/MacBook Pro/)).toBeInTheDocument();
        expect(screen.getByText(/LG Curved Ultra-wide/)).toBeInTheDocument();
        expect(screen.getByText(/Apple Magic Keyboard/)).toBeInTheDocument();
    });

    test("should render hardware links", () => {
        const { container } = render(<SectionHardware />);

        const links = container.querySelectorAll("a");
        expect(links.length).toBeGreaterThan(0);
    });

    test("should have correct link attributes", () => {
        const { container } = render(<SectionHardware />);

        const links = container.querySelectorAll("a");
        links.forEach((link) => {
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noreferrer");
        });
    });
});
