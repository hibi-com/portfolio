import { render, screen } from "@testing-library/react";
import { SectionEducation } from "./SectionEducation";

describe("SectionEducation Component", () => {
    test("should render education section", () => {
        render(<SectionEducation />);

        expect(screen.getByText("Education")).toBeInTheDocument();
    });

    test("should render heading", () => {
        render(<SectionEducation />);

        const heading = screen.getByRole("heading", { level: 2 });
        expect(heading).toHaveTextContent("Education");
    });

    test("should render university name", () => {
        render(<SectionEducation />);

        expect(screen.getByText("San Francisco State University")).toBeInTheDocument();
    });

    test("should render major", () => {
        render(<SectionEducation />);

        expect(screen.getAllByText(/Industrial Design/).length).toBeGreaterThan(0);
        expect(screen.getByText(/incomplete/)).toBeInTheDocument();
    });

    test("should render description", () => {
        render(<SectionEducation />);

        expect(screen.getByText(/Mechanical Engineering/)).toBeInTheDocument();
        expect(screen.getAllByText(/Industrial Design/).length).toBeGreaterThan(0);
    });

    test("should render list items", () => {
        render(<SectionEducation />);

        expect(screen.getByText(/Industrial Designers Society of America/)).toBeInTheDocument();
        expect(screen.getAllByText(/Teaching Assistant/).length).toBeGreaterThan(0);
    });
});
