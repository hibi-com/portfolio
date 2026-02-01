import { createElement } from "react";
import { describe, expect, test } from "vitest";
import type { PostProps } from "./types";

describe("Post Widget Types", () => {
    describe("PostProps", () => {
        test("should have required fields", () => {
            const props: PostProps = {
                children: "Post content",
                title: "Post Title",
                date: "2024-01-01",
            };

            expect(props.title).toBe("Post Title");
            expect(props.date).toBe("2024-01-01");
            expect(props.children).toBe("Post content");
        });

        test("should support children as string", () => {
            const props: PostProps = {
                children: "String content",
                title: "Title",
                date: "2024-01-01",
            };

            expect(props.children).toBe("String content");
        });

        test("should support children as ReactNode", () => {
            const reactElement = createElement("div", null, "React content");
            const props: PostProps = {
                children: reactElement,
                title: "Title",
                date: "2024-01-01",
            };

            expect(props.children).toBeDefined();
            expect(props.children).toBe(reactElement);
        });

        test("should support optional banner", () => {
            const props: PostProps = {
                children: "Content",
                title: "Title",
                date: "2024-01-01",
                banner: "/images/banner.jpg",
            };

            expect(props.banner).toBe("/images/banner.jpg");
        });

        test("should support optional timecode", () => {
            const props: PostProps = {
                children: "Content",
                title: "Title",
                date: "2024-01-01",
                timecode: "5:30",
            };

            expect(props.timecode).toBe("5:30");
        });

        test("should support all optional fields", () => {
            const props: PostProps = {
                children: "Content",
                title: "Title",
                date: "2024-01-01",
                banner: "/images/banner.jpg",
                timecode: "10:45",
            };

            expect(props.banner).toBe("/images/banner.jpg");
            expect(props.timecode).toBe("10:45");
        });

        test("should work with minimal required fields", () => {
            const props: PostProps = {
                children: "Content",
                title: "Title",
                date: "2024-01-01",
            };

            expect(props.title).toBe("Title");
            expect(props.date).toBe("2024-01-01");
            expect(props.banner).toBeUndefined();
            expect(props.timecode).toBeUndefined();
        });
    });
});
