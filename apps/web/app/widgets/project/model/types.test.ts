import { createElement } from "react";
import { describe, expect, test } from "vitest";
import type {
    ProjectBackgroundProps,
    ProjectContainerProps,
    ProjectHeaderProps,
    ProjectImageProps,
    ProjectSectionColumnsProps,
    ProjectSectionContentProps,
    ProjectSectionHeadingProps,
    ProjectSectionProps,
    ProjectSectionTextProps,
    ProjectTextRowProps,
} from "./types";

describe("Project Widget Types", () => {
    describe("ProjectHeaderProps", () => {
        test("should have required fields", () => {
            const props: ProjectHeaderProps = {
                title: "Project Title",
                description: "Project description",
            };

            expect(props.title).toBe("Project Title");
            expect(props.description).toBe("Project description");
        });

        test("should support optional fields", () => {
            const props: ProjectHeaderProps = {
                title: "Title",
                description: "Description",
                linkLabel: "View Project",
                url: "https://example.com",
                roles: ["Developer", "Designer"],
                className: "custom-header",
            };

            expect(props.linkLabel).toBe("View Project");
            expect(props.url).toBe("https://example.com");
            expect(props.roles).toEqual(["Developer", "Designer"]);
            expect(props.className).toBe("custom-header");
        });

        test("should support readonly roles array", () => {
            const props: ProjectHeaderProps = {
                title: "Title",
                description: "Description",
                roles: ["Role 1", "Role 2"] as readonly string[],
            };

            expect(props.roles).toEqual(["Role 1", "Role 2"]);
        });
    });

    describe("ProjectContainerProps", () => {
        test("should extend ComponentProps<article>", () => {
            const props: ProjectContainerProps = {
                className: "custom-article",
                id: "project-1",
            };

            expect(props.className).toBe("custom-article");
            expect(props.id).toBe("project-1");
        });
    });

    describe("ProjectSectionProps", () => {
        test("should have required children field", () => {
            const props: ProjectSectionProps = {
                children: "Section content",
            };

            expect(props.children).toBe("Section content");
        });

        test("should support all optional fields", () => {
            const backgroundElement = createElement("div", null, "Background");
            const props: ProjectSectionProps = {
                children: "Content",
                className: "custom-section",
                light: true,
                padding: "both",
                fullHeight: true,
                backgroundOverlayOpacity: 0.5,
                backgroundElement,
            };

            expect(props.className).toBe("custom-section");
            expect(props.light).toBe(true);
            expect(props.padding).toBe("both");
            expect(props.fullHeight).toBe(true);
            expect(props.backgroundOverlayOpacity).toBe(0.5);
            expect(props.backgroundElement).toBe(backgroundElement);
        });

        test("should support all padding values", () => {
            const paddingValues: ProjectSectionProps["padding"][] = ["both", "top", "bottom", "none"];

            paddingValues.forEach((padding) => {
                const props: ProjectSectionProps = {
                    children: "Content",
                    padding,
                };

                expect(props.padding).toBe(padding);
            });
        });
    });

    describe("ProjectBackgroundProps", () => {
        test("should extend ComponentProps<img>", () => {
            const props: ProjectBackgroundProps = {
                src: "/images/bg.jpg",
                alt: "Background",
                opacity: 0.8,
                className: "bg-image",
            };

            expect(props.src).toBe("/images/bg.jpg");
            expect(props.alt).toBe("Background");
            expect(props.opacity).toBe(0.8);
            expect(props.className).toBe("bg-image");
        });
    });

    describe("ProjectImageProps", () => {
        test("should have required alt field", () => {
            const props: ProjectImageProps = {
                alt: "Image description",
            };

            expect(props.alt).toBe("Image description");
        });

        test("should support optional fields", () => {
            const props: ProjectImageProps = {
                alt: "Image",
                src: "/images/image.jpg",
                className: "custom-image",
            };

            expect(props.src).toBe("/images/image.jpg");
            expect(props.className).toBe("custom-image");
        });
    });

    describe("ProjectSectionContentProps", () => {
        test("should extend ComponentProps<div>", () => {
            const props: ProjectSectionContentProps = {
                className: "content",
                width: "m",
            };

            expect(props.className).toBe("content");
            expect(props.width).toBe("m");
        });

        test("should support all width values", () => {
            const widths: ProjectSectionContentProps["width"][] = ["s", "m", "l", "xl"];

            widths.forEach((width) => {
                const props: ProjectSectionContentProps = {
                    width,
                };

                expect(props.width).toBe(width);
            });
        });
    });

    describe("ProjectSectionHeadingProps", () => {
        test("should extend ComponentProps<h1>", () => {
            const props: ProjectSectionHeadingProps = {
                className: "heading",
                level: 2,
                as: "h2",
            };

            expect(props.className).toBe("heading");
            expect(props.level).toBe(2);
            expect(props.as).toBe("h2");
        });

        test("should support all as values", () => {
            const asValues: ProjectSectionHeadingProps["as"][] = ["h1", "h2", "h3", "h4", "h5", "h6"];

            asValues.forEach((as) => {
                const props: ProjectSectionHeadingProps = {
                    as,
                };

                expect(props.as).toBe(as);
            });
        });
    });

    describe("ProjectSectionTextProps", () => {
        test("should extend ComponentProps<p>", () => {
            const props: ProjectSectionTextProps = {
                className: "text",
            };

            expect(props.className).toBe("text");
        });
    });

    describe("ProjectTextRowProps", () => {
        test("should extend ComponentProps<div>", () => {
            const props: ProjectTextRowProps = {
                center: true,
                stretch: true,
                justify: "center",
                width: "l",
                noMargin: true,
                className: "row",
                centerMobile: true,
            };

            expect(props.center).toBe(true);
            expect(props.stretch).toBe(true);
            expect(props.justify).toBe("center");
            expect(props.width).toBe("l");
            expect(props.noMargin).toBe(true);
            expect(props.className).toBe("row");
            expect(props.centerMobile).toBe(true);
        });

        test("should support all justify values", () => {
            const justifyValues: ProjectTextRowProps["justify"][] = ["center", "start", "end", "space-between"];

            justifyValues.forEach((justify) => {
                const props: ProjectTextRowProps = {
                    justify,
                };

                expect(props.justify).toBe(justify);
            });
        });
    });

    describe("ProjectSectionColumnsProps", () => {
        test("should extend ProjectSectionContentProps", () => {
            const props: ProjectSectionColumnsProps = {
                className: "columns",
                width: "xl",
                centered: true,
            };

            expect(props.className).toBe("columns");
            expect(props.width).toBe("xl");
            expect(props.centered).toBe(true);
        });
    });
});
