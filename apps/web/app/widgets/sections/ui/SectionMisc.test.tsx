import { render, screen } from "@testing-library/react";
import { SectionMisc } from "./SectionMisc";

describe("SectionMisc Component", () => {
    test("should render miscellaneous section", () => {
        render(<SectionMisc />);

        expect(screen.getByText(/Miscellaneous/)).toBeInTheDocument();
    });

    test("should render heading with emoji", () => {
        render(<SectionMisc />);

        const heading = screen.getByRole("heading", { level: 2 });
        expect(heading).toHaveTextContent("Miscellaneous 🧩");
    });

    test("should render description", () => {
        render(<SectionMisc />);

        expect(screen.getByText(/San Diego/)).toBeInTheDocument();
        expect(screen.getByText(/beach/)).toBeInTheDocument();
        expect(screen.getByText(/motorcycle/)).toBeInTheDocument();
    });

    test("should render images", () => {
        const { container } = render(<SectionMisc />);

        const images = container.querySelectorAll("img");
        expect(images.length).toBeGreaterThan(0);
    });

    test("should have correct image alt texts", () => {
        render(<SectionMisc />);

        expect(screen.getByAltText(/Me, my son, and our dog at the beach/)).toBeInTheDocument();
        const thruxtonImages = screen.getAllByAltText(/Triumph Thruxton/);
        expect(thruxtonImages.length).toBeGreaterThan(0);
    });
});
