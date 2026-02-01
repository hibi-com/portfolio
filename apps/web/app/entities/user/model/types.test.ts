import { describe, expect, test } from "vitest";
import type { Experience, Social } from "./types";

describe("User Entity Types", () => {
    describe("Experience", () => {
        test("should have required fields", () => {
            const experience: Experience = {
                company: "Test Company",
                companyUrl: "https://example.com",
                date: "2024-01-01",
                description: "Test description",
                highlights: ["Highlight 1", "Highlight 2"],
                tags: ["TypeScript", "React"],
                title: "Software Engineer",
            };

            expect(experience.company).toBe("Test Company");
            expect(experience.companyUrl).toBe("https://example.com");
            expect(experience.date).toBe("2024-01-01");
            expect(experience.description).toBe("Test description");
            expect(experience.highlights).toEqual(["Highlight 1", "Highlight 2"]);
            expect(experience.tags).toEqual(["TypeScript", "React"]);
            expect(experience.title).toBe("Software Engineer");
        });

        test("should support optional fields", () => {
            const experience: Experience = {
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

            expect(experience.contract).toBe(true);
            expect(experience.dateRange).toBeDefined();
            expect(experience.image).toBe("https://example.com/logo.png");
        });

        test("should support dateRange with optional end date", () => {
            const experience: Experience = {
                company: "Test Company",
                companyUrl: "https://example.com",
                date: "2024-01-01",
                description: "Test description",
                highlights: [],
                tags: [],
                title: "Software Engineer",
                dateRange: [new Date("2024-01-01")],
            };

            expect(experience.dateRange?.[0]).toBeInstanceOf(Date);
            expect(experience.dateRange?.[1]).toBeUndefined();
        });
    });

    describe("Social", () => {
        test("should have required fields", () => {
            const social: Social = {
                icon: "github",
                title: "GitHub",
                url: "https://github.com/user",
            };

            expect(social.icon).toBe("github");
            expect(social.title).toBe("GitHub");
            expect(social.url).toBe("https://github.com/user");
        });
    });
});
