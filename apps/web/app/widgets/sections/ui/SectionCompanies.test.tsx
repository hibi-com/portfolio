import { render, screen } from "@testing-library/react";
import { SectionCompanies } from "./SectionCompanies";

describe("SectionCompanies Component", () => {
    test("should render companies section", () => {
        render(<SectionCompanies />);

        expect(screen.getByText(/Companies I've built things for/)).toBeInTheDocument();
    });

    test("should render heading", () => {
        render(<SectionCompanies />);

        const heading = screen.getByRole("heading", { level: 2 });
        expect(heading).toHaveTextContent("Companies I've built things for.");
    });

    test("should render company images", () => {
        const { container } = render(<SectionCompanies />);

        const images = container.querySelectorAll("img");
        expect(images.length).toBeGreaterThan(0);
    });

    test("should render company links", () => {
        const { container } = render(<SectionCompanies />);

        const links = container.querySelectorAll("a");
        expect(links.length).toBeGreaterThan(0);
    });

    test("should have grayscale filter style", () => {
        const { container } = render(<SectionCompanies />);

        const div = container.querySelector(".flex.flex-1.flex-wrap");
        expect(div).toHaveStyle({ filter: "grayscale(1)" });
    });
});
