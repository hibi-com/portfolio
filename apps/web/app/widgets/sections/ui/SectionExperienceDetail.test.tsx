import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import type { Experience } from "~/entities/user";
import { SectionExperienceDetail } from "./SectionExperienceDetail";

describe("SectionExperienceDetail Component", () => {
    const mockExperience: Experience = {
        company: "Test Company",
        companyUrl: "https://example.com",
        title: "Software Engineer",
        date: "2020 - Present",
        dateRange: [new Date("2020-01-01"), new Date()],
        description: "<p>Test description</p>",
        highlights: ["Highlight 1", "Highlight 2"],
        image: "https://example.com/logo.png",
        contract: false,
        tags: ["TypeScript", "React"],
    };

    test("should render experience detail", () => {
        render(<SectionExperienceDetail experience={mockExperience} />);

        expect(screen.getByText("Test Company")).toBeInTheDocument();
        expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });

    test("should render company link", () => {
        render(<SectionExperienceDetail experience={mockExperience} />);

        const companyLink = screen.getByText("Test Company").closest("a");
        expect(companyLink).toHaveAttribute("href", "https://example.com");
        expect(companyLink).toHaveAttribute("target", "_blank");
        expect(companyLink).toHaveAttribute("rel", "noreferrer");
    });

    test("should render contract label when contract is true", () => {
        const contractExperience = { ...mockExperience, contract: true };
        render(<SectionExperienceDetail experience={contractExperience} />);

        expect(screen.getByText("(contract)")).toBeInTheDocument();
    });

    test("should not render contract label when contract is false", () => {
        render(<SectionExperienceDetail experience={mockExperience} />);

        expect(screen.queryByText("(contract)")).not.toBeInTheDocument();
    });

    test("should render company image when provided", () => {
        render(<SectionExperienceDetail experience={mockExperience} />);

        const image = screen.getByAltText("Test Company favicon");
        expect(image).toHaveAttribute("src", "https://example.com/logo.png");
    });

    test("should render highlights", () => {
        render(<SectionExperienceDetail experience={mockExperience} />);

        expect(screen.getByText("Highlight 1")).toBeInTheDocument();
        expect(screen.getByText("Highlight 2")).toBeInTheDocument();
    });

    test("should render date", () => {
        render(<SectionExperienceDetail experience={mockExperience} />);

        expect(screen.getByText("2020 - Present")).toBeInTheDocument();
    });

    test("should render description with HTML", () => {
        const { container } = render(<SectionExperienceDetail experience={mockExperience} />);

        const description = container.querySelector(".text-sm");
        expect(description).toBeInTheDocument();
    });

    test("should handle experience without image", () => {
        const experienceWithoutImage = { ...mockExperience, image: undefined };
        render(<SectionExperienceDetail experience={experienceWithoutImage} />);

        expect(screen.queryByAltText("Test Company favicon")).not.toBeInTheDocument();
    });

    test("should handle experience without dateRange", () => {
        const experienceWithoutDateRange = {
            ...mockExperience,
            dateRange: undefined,
        };
        render(<SectionExperienceDetail experience={experienceWithoutDateRange} />);

        expect(screen.getByText("Test Company")).toBeInTheDocument();
    });
});
