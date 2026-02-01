import { createElement } from "react";
import { describe, expect, test } from "vitest";
import type { HeroProps } from "./types";

describe("Hero Widget Types", () => {
    describe("HeroProps", () => {
        test("should have required fields", () => {
            const props: HeroProps = {
                highlight: "Highlighted text",
                tag: "h1",
            };

            expect(props.highlight).toBe("Highlighted text");
            expect(props.tag).toBe("h1");
        });

        test("should support all tag types", () => {
            const tags: HeroProps["tag"][] = ["h1", "h2", "h3", "h4", "h5", "h6"];

            tags.forEach((tag) => {
                const props: HeroProps = {
                    highlight: "Text",
                    tag,
                };

                expect(props.tag).toBe(tag);
            });
        });

        test("should support copy as string", () => {
            const props: HeroProps = {
                highlight: "Highlight",
                tag: "h1",
                copy: "Copy text",
            };

            expect(props.copy).toBe("Copy text");
            expect(typeof props.copy).toBe("string");
        });

        test("should support copy as ReactElement", () => {
            const reactElement = createElement("span", null, "React element");
            const props: HeroProps = {
                highlight: "Highlight",
                tag: "h1",
                copy: reactElement,
            };

            expect(props.copy).toBeDefined();
            expect(props.copy).toBe(reactElement);
        });

        test("should support optional className", () => {
            const props: HeroProps = {
                highlight: "Highlight",
                tag: "h1",
                className: "custom-hero",
            };

            expect(props.className).toBe("custom-hero");
        });

        test("should work with minimal required fields", () => {
            const props: HeroProps = {
                highlight: "Minimal",
                tag: "h2",
            };

            expect(props.highlight).toBe("Minimal");
            expect(props.tag).toBe("h2");
            expect(props.copy).toBeUndefined();
            expect(props.className).toBeUndefined();
        });
    });
});
