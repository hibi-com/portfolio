import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SectionAmbitions } from "./SectionAmbitions";

describe("SectionAmbitions Component", () => {
    test("should render ambitions section", () => {
        render(<SectionAmbitions />);

        expect(screen.getByText(/Ambitions/)).toBeInTheDocument();
    });

    test("should render heading with emoji", () => {
        render(<SectionAmbitions />);

        const heading = screen.getByRole("heading", { level: 2 });
        expect(heading).toHaveTextContent("Ambitions 🎯");
    });

    test("should render content text", () => {
        render(<SectionAmbitions />);

        expect(screen.getByText("15+")).toBeInTheDocument();
        expect(screen.getByText(/new challenges/)).toBeInTheDocument();
    });
});
