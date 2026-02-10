import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SectionSoftware } from "./SectionSoftware";

describe("SectionSoftware Component", () => {
    test("should render software section", () => {
        render(<SectionSoftware />);

        expect(screen.getByText(/Software/)).toBeInTheDocument();
    });

    test("should render heading with emoji", () => {
        render(<SectionSoftware />);

        const heading = screen.getByRole("heading", { level: 2 });
        expect(heading).toHaveTextContent("Software 👨‍💻");
    });

    test("should render software items", () => {
        render(<SectionSoftware />);

        expect(screen.getByText(/Visual Studio Code/)).toBeInTheDocument();
        expect(screen.getByText(/Iterm2/)).toBeInTheDocument();
        expect(screen.getByText(/Docker Desktop/)).toBeInTheDocument();
        expect(screen.getAllByText(/Figma/).length).toBeGreaterThan(0);
    });

    test("should render software links", () => {
        const { container } = render(<SectionSoftware />);

        const links = container.querySelectorAll("a");
        expect(links.length).toBeGreaterThan(0);
    });

    test("should have correct link attributes", () => {
        const { container } = render(<SectionSoftware />);

        const links = container.querySelectorAll("a");
        links.forEach((link) => {
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noreferrer");
        });
    });

    test("should render descriptions for each software", () => {
        render(<SectionSoftware />);

        expect(screen.getByText(/editor of choice/)).toBeInTheDocument();
        expect(screen.getByText(/terminal users/)).toBeInTheDocument();
        expect(screen.getAllByText(/Docker/).length).toBeGreaterThan(0);
    });
});
