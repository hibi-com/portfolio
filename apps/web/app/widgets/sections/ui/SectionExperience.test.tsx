import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SectionExperience } from "./SectionExperience";

describe("SectionExperience Component", () => {
    test("should render experience section", () => {
        render(<SectionExperience />);

        const heading = screen.getByText("Experience");
        expect(heading).toBeInTheDocument();
    });

    test("should show 'Show more' button initially", () => {
        render(<SectionExperience />);

        const button = screen.getByText("Show more");
        expect(button).toBeInTheDocument();
    });

    test("should toggle to 'Show less' when clicked", () => {
        render(<SectionExperience />);

        const button = screen.getByText("Show more");
        fireEvent.click(button);

        expect(screen.getByText("Show less")).toBeInTheDocument();
    });

    test("should toggle back to 'Show more' when clicked again", () => {
        render(<SectionExperience />);

        const button = screen.getByText("Show more");
        fireEvent.click(button);
        fireEvent.click(screen.getByText("Show less"));

        expect(screen.getByText("Show more")).toBeInTheDocument();
    });

    test("should render experience items", () => {
        render(<SectionExperience />);

        const section = screen.getByText("Experience").closest("section");
        expect(section).toBeInTheDocument();
    });
});
