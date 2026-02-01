import { describe, expect, test } from "vitest";
import { SOCIAL_GITHUB } from "~/shared/config/constants";
import type { NavLink, SocialLink } from "../model/types";
import { navLinks, socialLinks } from "./NavData";

describe("NavData", () => {
    describe("navLinks", () => {
        test("should export navLinks array", () => {
            expect(navLinks).toBeDefined();
            expect(Array.isArray(navLinks)).toBe(true);
        });

        test("should have correct number of links", () => {
            expect(navLinks).toHaveLength(4);
        });

        test("should have all required fields for each link", () => {
            navLinks.forEach((link) => {
                expect(link).toHaveProperty("label");
                expect(link).toHaveProperty("pathname");
                expect(typeof link.label).toBe("string");
                expect(typeof link.pathname).toBe("string");
            });
        });

        test("should have correct link structure", () => {
            const expectedLinks: NavLink[] = [
                {
                    label: "Projects",
                    pathname: "/#project-1",
                },
                {
                    label: "Details",
                    pathname: "/#details",
                },
                {
                    label: "Articles",
                    pathname: "/articles",
                },
                {
                    label: "Contact",
                    pathname: "/contact",
                },
            ];

            navLinks.forEach((link, index) => {
                expect(link.label).toBe(expectedLinks[index]?.label);
                expect(link.pathname).toBe(expectedLinks[index]?.pathname);
            });
        });

        test("should have non-empty labels", () => {
            navLinks.forEach((link) => {
                expect(link.label.length).toBeGreaterThan(0);
            });
        });

        test("should have valid pathnames", () => {
            navLinks.forEach((link) => {
                expect(link.pathname).toMatch(/^\//);
            });
        });
    });

    describe("socialLinks", () => {
        test("should export socialLinks array", () => {
            expect(socialLinks).toBeDefined();
            expect(Array.isArray(socialLinks)).toBe(true);
        });

        test("should have at least one social link", () => {
            expect(socialLinks.length).toBeGreaterThanOrEqual(1);
        });

        test("should have all required fields for each link", () => {
            socialLinks.forEach((link) => {
                expect(link).toHaveProperty("label");
                expect(link).toHaveProperty("url");
                expect(link).toHaveProperty("icon");
                expect(typeof link.label).toBe("string");
                expect(typeof link.url).toBe("string");
                expect(typeof link.icon).toBe("string");
            });
        });

        test("should have valid URLs", () => {
            socialLinks.forEach((link) => {
                expect(link.url).toMatch(/^https?:\/\//);
            });
        });

        test("should have non-empty labels and icons", () => {
            socialLinks.forEach((link) => {
                expect(link.label.length).toBeGreaterThan(0);
                expect(link.icon.length).toBeGreaterThan(0);
            });
        });

        test("should include GitHub link with correct URL", () => {
            const githubLink = socialLinks.find((link) => link.icon === "github");

            expect(githubLink).toBeDefined();
            expect(githubLink?.label).toBe("Github");
            expect(githubLink?.url).toBe(SOCIAL_GITHUB);
        });

        test("should match expected social links structure", () => {
            const expectedSocialLinks: SocialLink[] = [
                {
                    label: "Github",
                    url: SOCIAL_GITHUB,
                    icon: "github",
                },
            ];

            expect(socialLinks).toHaveLength(expectedSocialLinks.length);
            socialLinks.forEach((link, index) => {
                expect(link.label).toBe(expectedSocialLinks[index]?.label);
                expect(link.url).toBe(expectedSocialLinks[index]?.url);
                expect(link.icon).toBe(expectedSocialLinks[index]?.icon);
            });
        });
    });
});
