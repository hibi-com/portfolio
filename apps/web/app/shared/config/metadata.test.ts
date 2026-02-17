import type { MetaDataOptions } from "./metadata";
import { getMetaData, getMetaDataBase } from "./metadata";

describe("metadata", () => {
    describe("getMetaDataBase", () => {
        test("should return base meta descriptors", () => {
            const result = getMetaDataBase();

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThan(0);
        });

        test("should include charset", () => {
            const result = getMetaDataBase();

            const charset = result.find((meta): meta is { charset: string } => "charset" in meta);
            expect(charset?.charset).toBe("utf-8");
        });

        test("should include author", () => {
            const result = getMetaDataBase();

            const author = result.find((meta): meta is { author: string } => "author" in meta);
            expect(author?.author).toBeTruthy();
        });

        test("should include viewport", () => {
            const result = getMetaDataBase();

            const viewport = result.find((meta): meta is { viewport: string } => "viewport" in meta);
            expect(viewport?.viewport).toBeTruthy();
        });
    });

    describe("getMetaData", () => {
        const defaultOptions: MetaDataOptions = {
            canonical: "https://example.com",
        };

        test("should return meta descriptors with default values", () => {
            const result = getMetaData(defaultOptions);

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThan(0);
        });

        test("should use custom title", () => {
            const options: MetaDataOptions = {
                ...defaultOptions,
                title: "Custom Title",
            };

            const result = getMetaData(options);

            const titleMeta = result.find((meta): meta is { title: string } => "title" in meta);
            expect(titleMeta?.title).toBe("Custom Title");
        });

        test("should use custom description", () => {
            const options: MetaDataOptions = {
                ...defaultOptions,
                description: "Custom Description",
            };

            const result = getMetaData(options);

            const descMeta = result.find(
                (meta): meta is { name: string; content: string } => "name" in meta && meta.name === "description",
            );
            expect(descMeta?.content).toBe("Custom Description");
        });

        test("should use custom image", () => {
            const options: MetaDataOptions = {
                ...defaultOptions,
                image: "https://example.com/image.jpg",
            };

            const result = getMetaData(options);

            const imageMeta = result.find((meta): meta is { image: string } => "image" in meta);
            expect(imageMeta?.image).toBe("https://example.com/image.jpg");
        });

        test("should include Open Graph meta tags", () => {
            const result = getMetaData(defaultOptions);

            const ogType = result.find(
                (meta): meta is { property: string; content: string } =>
                    "property" in meta && meta.property === "og:type",
            );
            expect(ogType?.content).toBe("website");

            const ogUrl = result.find(
                (meta): meta is { property: string; content: string } =>
                    "property" in meta && meta.property === "og:url",
            );
            expect(ogUrl?.content).toBe(defaultOptions.canonical);
        });

        test("should include Twitter meta tags", () => {
            const result = getMetaData(defaultOptions);

            const twitterCard = result.find(
                (meta): meta is { property: string; content: string } =>
                    "property" in meta && meta.property === "twitter:card",
            );
            expect(twitterCard?.content).toBe("summary_large_image");

            const twitterCreator = result.find(
                (meta): meta is { property: string; content: string } =>
                    "property" in meta && meta.property === "twitter:creator",
            );
            expect(twitterCreator?.content).toBe("@visormatt");
        });
    });
});
