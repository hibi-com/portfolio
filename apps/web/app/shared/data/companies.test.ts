import { type Data, data } from "./companies";

describe("companies data", () => {
    test("should export data array", () => {
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
    });

    test("should have at least one company", () => {
        expect(data.length).toBeGreaterThan(0);
    });

    test("should have all required fields for each company", () => {
        data.forEach((company) => {
            expect(company).toHaveProperty("company");
            expect(company).toHaveProperty("className");
            expect(company).toHaveProperty("image");
            expect(company).toHaveProperty("url");
            expect(typeof company.company).toBe("string");
            expect(typeof company.className).toBe("string");
            expect(typeof company.image).toBe("string");
            expect(typeof company.url).toBe("string");
        });
    });

    test("should have non-empty company names", () => {
        data.forEach((company) => {
            expect(company.company.length).toBeGreaterThan(0);
        });
    });

    test("should have valid URLs", () => {
        data.forEach((company) => {
            expect(company.url).toMatch(/^https?:\/\//);
        });
    });

    test("should have valid image paths", () => {
        data.forEach((company) => {
            expect(company.image).toMatch(/^\/images\/svg\//);
        });
    });

    test("should have valid className format", () => {
        data.forEach((company) => {
            expect(company.className).toMatch(/^h-\d+ md:h-\d+$/);
        });
    });

    test("should match Data interface", () => {
        data.forEach((company) => {
            const typedCompany: Data = company;
            expect(typedCompany).toBeDefined();
        });
    });
});
