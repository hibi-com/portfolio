import { describe, expect, test } from "vitest";
import type { ShareButtonProps, ShareOptions } from "./types";

describe("ShareButton Feature Types", () => {
    describe("ShareOptions", () => {
        test("should support all optional fields", () => {
            const options: ShareOptions = {
                url: "https://example.com",
                title: "Test Title",
                text: "Test Text",
            };

            expect(options.url).toBe("https://example.com");
            expect(options.title).toBe("Test Title");
            expect(options.text).toBe("Test Text");
        });

        test("should work with partial fields", () => {
            const options: ShareOptions = {
                url: "https://example.com",
            };

            expect(options.url).toBe("https://example.com");
            expect(options.title).toBeUndefined();
            expect(options.text).toBeUndefined();
        });

        test("should work without any fields", () => {
            const options: ShareOptions = {};

            expect(options).toBeDefined();
        });
    });

    describe("ShareButtonProps", () => {
        test("should support all optional fields", () => {
            const props: ShareButtonProps = {
                url: "https://example.com",
                title: "Test Title",
                text: "Test Text",
                className: "custom-class",
                showLabel: true,
                disabled: false,
            };

            expect(props.url).toBe("https://example.com");
            expect(props.title).toBe("Test Title");
            expect(props.text).toBe("Test Text");
            expect(props.className).toBe("custom-class");
            expect(props.showLabel).toBe(true);
            expect(props.disabled).toBe(false);
        });

        test("should support disabled state", () => {
            const props: ShareButtonProps = {
                disabled: true,
            };

            expect(props.disabled).toBe(true);
        });

        test("should support showLabel", () => {
            const props: ShareButtonProps = {
                showLabel: false,
            };

            expect(props.showLabel).toBe(false);
        });

        test("should work with minimal props", () => {
            const props: ShareButtonProps = {};

            expect(props).toBeDefined();
        });
    });
});
