import type { Experience, Social } from "~/entities/user";
import { experience, social } from "./resume";

function validateStringArray(items: unknown[]): void {
    items.forEach((item) => {
        expect(typeof item).toBe("string");
    });
}

describe("resume data", () => {
    describe("experience", () => {
        test("should export experience array", () => {
            expect(experience).toBeDefined();
            expect(Array.isArray(experience)).toBe(true);
        });

        test("should have at least one experience", () => {
            expect(experience.length).toBeGreaterThan(0);
        });

        test("should have all required fields for each experience", () => {
            experience.forEach((exp) => {
                expect(exp).toHaveProperty("company");
                expect(exp).toHaveProperty("date");
                expect(exp).toHaveProperty("description");
                expect(exp).toHaveProperty("title");
                expect(typeof exp.company).toBe("string");
                expect(typeof exp.date).toBe("string");
                expect(typeof exp.description).toBe("string");
                expect(typeof exp.title).toBe("string");
            });
        });

        test("should have non-empty company names", () => {
            experience.forEach((exp) => {
                expect(exp.company.length).toBeGreaterThan(0);
            });
        });

        test("should have valid company URLs when present", () => {
            experience.forEach((exp) => {
                if (exp.companyUrl) {
                    expect(exp.companyUrl).toMatch(/^https?:\/\//);
                }
            });
        });

        test("should have highlights array when present", () => {
            experience.forEach((exp) => {
                if (!exp.highlights) {
                    return;
                }
                expect(Array.isArray(exp.highlights)).toBe(true);
                validateStringArray(exp.highlights);
            });
        });

        test("should have tags array when present", () => {
            experience.forEach((exp) => {
                if (!exp.tags) {
                    return;
                }
                expect(Array.isArray(exp.tags)).toBe(true);
                validateStringArray(exp.tags);
            });
        });

        test("should match Experience interface", () => {
            experience.forEach((exp) => {
                const typedExp: Experience = exp;
                expect(typedExp).toBeDefined();
            });
        });
    });

    describe("social", () => {
        test("should export social array", () => {
            expect(social).toBeDefined();
            expect(Array.isArray(social)).toBe(true);
        });

        test("should have at least one social link", () => {
            expect(social.length).toBeGreaterThan(0);
        });

        test("should have all required fields for each social link", () => {
            social.forEach((link) => {
                expect(link).toHaveProperty("icon");
                expect(link).toHaveProperty("title");
                expect(link).toHaveProperty("url");
                expect(typeof link.icon).toBe("string");
                expect(typeof link.title).toBe("string");
                expect(typeof link.url).toBe("string");
            });
        });

        test("should have valid URLs", () => {
            social.forEach((link) => {
                expect(link.url).toMatch(/^(https?:\/\/|mailto:)/);
            });
        });

        test("should have valid icon paths", () => {
            social.forEach((link) => {
                expect(link.icon).toMatch(/^\/images\/svg\//);
            });
        });

        test("should match Social interface", () => {
            social.forEach((link) => {
                const typedLink: Social = link;
                expect(typedLink).toBeDefined();
            });
        });
    });
});
