import { portfolioContentSchema, portfolioFormDataSchema, portfolioListItemSchema, portfolioSchema } from "./schemas";

describe("Portfolio Entity Schemas", () => {
    describe("portfolioSchema", () => {
        test("should validate valid portfolio", () => {
            const validPortfolio = {
                id: "portfolio-1",
                title: "Test Portfolio",
                slug: "test-portfolio",
                company: "Example Corp",
                date: "2024-01-01",
                current: false,
                createdAt: "2024-01-01",
                updatedAt: "2024-01-01",
            };

            const result = portfolioSchema.safeParse(validPortfolio);
            expect(result.success).toBe(true);
        });

        test("should validate portfolio with optional fields", () => {
            const portfolioWithOptional = {
                id: "portfolio-1",
                title: "Test Portfolio",
                slug: "test-portfolio",
                company: "Example Corp",
                date: "2024-01-01",
                current: true,
                overview: "Project overview",
                description: "Detailed description",
                content: "<p>Content</p>",
                thumbnailTemp: "https://example.com/thumb.jpg",
                images: [{ url: "https://example.com/image.jpg" }],
                intro: "Introduction",
                createdAt: "2024-01-01",
                updatedAt: "2024-01-02",
            };

            const result = portfolioSchema.safeParse(portfolioWithOptional);
            expect(result.success).toBe(true);
        });

        test("should reject invalid portfolio", () => {
            const invalidPortfolios = [
                {
                    id: "",
                    title: "Test",
                    slug: "test",
                    company: "Corp",
                    date: "2024-01-01",
                    current: false,
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                },
                {
                    id: "portfolio-1",
                    title: "",
                    slug: "test",
                    company: "Corp",
                    date: "2024-01-01",
                    current: false,
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                },
            ];

            for (const invalid of invalidPortfolios) {
                const result = portfolioSchema.safeParse(invalid);
                expect(result.success).toBe(false);
            }
        });
    });

    describe("portfolioContentSchema", () => {
        test("should validate valid content", () => {
            const validContent = {
                html: "<p>Content</p>",
            };

            const result = portfolioContentSchema.safeParse(validContent);
            expect(result.success).toBe(true);
        });
    });

    describe("portfolioListItemSchema", () => {
        test("should validate valid list item", () => {
            const validListItem = {
                title: "Test Portfolio",
                slug: "test-portfolio",
                company: "Example Corp",
                date: "2024-01-01",
                current: false,
            };

            const result = portfolioListItemSchema.safeParse(validListItem);
            expect(result.success).toBe(true);
        });

        test("should validate list item with optional id", () => {
            const listItemWithId = {
                id: "portfolio-1",
                title: "Test Portfolio",
                slug: "test-portfolio",
                company: "Example Corp",
                date: "2024-01-01",
                current: true,
                overview: "Overview text",
            };

            const result = portfolioListItemSchema.safeParse(listItemWithId);
            expect(result.success).toBe(true);
        });
    });

    describe("portfolioFormDataSchema", () => {
        test("should validate valid form data", () => {
            const validFormData = {
                title: "New Portfolio",
                slug: "new-portfolio",
                company: "New Corp",
                date: "2024-01-01",
                current: false,
            };

            const result = portfolioFormDataSchema.safeParse(validFormData);
            expect(result.success).toBe(true);
        });

        test("should validate form data with optional fields", () => {
            const formDataWithOptional = {
                title: "New Portfolio",
                slug: "new-portfolio",
                company: "New Corp",
                date: "2024-01-01",
                current: true,
                overview: "Project overview",
                description: "Description",
                content: { html: "<p>Content</p>" },
                thumbnailTemp: "https://example.com/thumb.jpg",
                intro: "Intro text",
            };

            const result = portfolioFormDataSchema.safeParse(formDataWithOptional);
            expect(result.success).toBe(true);
        });

        test("should reject invalid form data", () => {
            const invalidFormData = [
                { title: "", slug: "test", company: "Corp", date: "2024-01-01", current: false },
                { title: "Test", slug: "", company: "Corp", date: "2024-01-01", current: false },
                { title: "Test", slug: "test", company: "", date: "2024-01-01", current: false },
                { title: "Test", slug: "test", company: "Corp", date: "", current: false },
            ];

            for (const invalid of invalidFormData) {
                const result = portfolioFormDataSchema.safeParse(invalid);
                expect(result.success).toBe(false);
            }
        });
    });
});
