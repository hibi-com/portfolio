import { describe, expect, test } from "vitest";
import type { Experience } from "~/entities/user";
import type { SectionExperienceDetailProps } from "./types";

describe("Sections Widget Types", () => {
    describe("SectionExperienceDetailProps", () => {
        test("should have required experience field", () => {
            const mockExperience: Experience = {
                company: "Test Company",
                companyUrl: "https://example.com",
                date: "2024-01-01",
                description: "Test description",
                highlights: ["Highlight 1", "Highlight 2"],
                tags: ["TypeScript", "React"],
                title: "Software Engineer",
            };

            const props: SectionExperienceDetailProps = {
                experience: mockExperience,
            };

            expect(props.experience).toBeDefined();
            expect(props.experience.company).toBe("Test Company");
            expect(props.experience.title).toBe("Software Engineer");
        });

        test("should support Experience with optional fields", () => {
            const mockExperience: Experience = {
                company: "Test Company",
                companyUrl: "https://example.com",
                date: "2024-01-01",
                description: "Test description",
                highlights: [],
                tags: [],
                title: "Software Engineer",
                contract: true,
                dateRange: [new Date("2024-01-01"), new Date("2024-12-31")],
                image: "https://example.com/logo.png",
            };

            const props: SectionExperienceDetailProps = {
                experience: mockExperience,
            };

            expect(props.experience.contract).toBe(true);
            expect(props.experience.dateRange).toBeDefined();
            expect(props.experience.image).toBe("https://example.com/logo.png");
        });

        test("should support Experience with dateRange without end date", () => {
            const mockExperience: Experience = {
                company: "Current Company",
                companyUrl: "https://example.com",
                date: "2024-01-01",
                description: "Current position",
                highlights: [],
                tags: [],
                title: "Engineer",
                dateRange: [new Date("2024-01-01")],
            };

            const props: SectionExperienceDetailProps = {
                experience: mockExperience,
            };

            expect(props.experience.dateRange?.[0]).toBeInstanceOf(Date);
            expect(props.experience.dateRange?.[1]).toBeUndefined();
        });
    });
});
