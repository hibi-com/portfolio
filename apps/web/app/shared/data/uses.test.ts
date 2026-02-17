import { type Image, images } from "./uses";

describe("uses data", () => {
    test("should export images array", () => {
        expect(images).toBeDefined();
        expect(Array.isArray(images)).toBe(true);
    });

    test("should have at least one image", () => {
        expect(images.length).toBeGreaterThan(0);
    });

    test("should have all required fields for each image", () => {
        images.forEach((image) => {
            expect(image).toHaveProperty("src");
            expect(image).toHaveProperty("title");
            expect(typeof image.src).toBe("string");
            expect(typeof image.title).toBe("string");
        });
    });

    test("should have valid image URLs", () => {
        images.forEach((image) => {
            expect(image.src).toMatch(/^https?:\/\//);
        });
    });

    test("should have non-empty titles", () => {
        images.forEach((image) => {
            expect(image.title.length).toBeGreaterThan(0);
        });
    });

    test("should match Image interface", () => {
        images.forEach((image) => {
            const typedImage: Image = image;
            expect(typedImage).toBeDefined();
        });
    });
});
