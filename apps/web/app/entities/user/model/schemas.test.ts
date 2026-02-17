import { experienceSchema, socialSchema } from "./schemas";

describe("User Entity Schemas", () => {
    describe("experienceSchema", () => {
        test("should validate valid experience", () => {
            const validExperience = {
                company: "Test Company",
                companyUrl: "https://example.com",
                date: "2024-01-01",
                description: "Test description",
                highlights: ["Highlight 1", "Highlight 2"],
                tags: ["TypeScript", "React"],
                title: "Software Engineer",
            };

            const result = experienceSchema.safeParse(validExperience);
            expect(result.success).toBe(true);
        });

        test("should validate experience with optional fields", () => {
            const experienceWithOptional = {
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

            const result = experienceSchema.safeParse(experienceWithOptional);
            expect(result.success).toBe(true);
        });

        test("should reject invalid experience", () => {
            const invalidExperiences = [
                {
                    company: "",
                    companyUrl: "https://example.com",
                    date: "2024-01-01",
                    description: "Test description",
                    highlights: [],
                    tags: [],
                    title: "Software Engineer",
                },
                {
                    company: "Test Company",
                    companyUrl: "not-a-url",
                    date: "2024-01-01",
                    description: "Test description",
                    highlights: [],
                    tags: [],
                    title: "Software Engineer",
                },
            ];

            for (const invalid of invalidExperiences) {
                const result = experienceSchema.safeParse(invalid);
                expect(result.success).toBe(false);
            }
        });
    });

    describe("socialSchema", () => {
        test("should validate valid social", () => {
            const validSocial = {
                icon: "github",
                title: "GitHub",
                url: "https://github.com/user",
            };

            const result = socialSchema.safeParse(validSocial);
            expect(result.success).toBe(true);
        });

        test("should reject invalid social", () => {
            const invalidSocials = [
                {
                    icon: "",
                    title: "GitHub",
                    url: "https://github.com/user",
                },
                {
                    icon: "github",
                    title: "",
                    url: "https://github.com/user",
                },
                {
                    icon: "github",
                    title: "GitHub",
                    url: "not-a-url",
                },
            ];

            for (const invalid of invalidSocials) {
                const result = socialSchema.safeParse(invalid);
                expect(result.success).toBe(false);
            }
        });
    });
});
