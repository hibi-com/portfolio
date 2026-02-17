import { render, screen } from "@testing-library/react";
import { SectionProficiencies } from "./SectionProficiencies";

describe("SectionProficiencies Component", () => {
    test("should render proficiencies section", () => {
        render(<SectionProficiencies />);

        expect(screen.getByText("Proficiencies")).toBeInTheDocument();
    });

    test("should render heading", () => {
        render(<SectionProficiencies />);

        const heading = screen.getByRole("heading", { level: 2 });
        expect(heading).toHaveTextContent("Proficiencies");
    });

    test("should render description", () => {
        render(<SectionProficiencies />);

        expect(screen.getByText(/Not saying I am an "expert"/)).toBeInTheDocument();
    });

    test("should render proficiency categories", () => {
        render(<SectionProficiencies />);

        expect(screen.getByText("DevOps")).toBeInTheDocument();
        expect(screen.getAllByText("Testing").length).toBeGreaterThan(0);
        expect(screen.getByText("Design")).toBeInTheDocument();
    });

    test("should render proficiency items", () => {
        render(<SectionProficiencies />);

        expect(screen.getByText(/React/)).toBeInTheDocument();
        expect(screen.getByText(/TypeScript/)).toBeInTheDocument();
        expect(screen.getAllByText(/Docker/).length).toBeGreaterThan(0);
    });
});
