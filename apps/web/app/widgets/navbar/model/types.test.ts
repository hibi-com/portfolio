import { describe, expect, test } from "vitest";
import type { NavLink, SocialLink } from "./types";

describe("Navbar Widget Types", () => {
    describe("NavLink", () => {
        test("should have required fields", () => {
            const navLink: NavLink = {
                label: "Home",
                pathname: "/",
            };

            expect(navLink.label).toBe("Home");
            expect(navLink.pathname).toBe("/");
        });

        test("should support different pathnames", () => {
            const navLinks: NavLink[] = [
                { label: "Home", pathname: "/" },
                { label: "About", pathname: "/about" },
                { label: "Blog", pathname: "/blog" },
                { label: "Portfolio", pathname: "/portfolio" },
            ];

            navLinks.forEach((link) => {
                expect(link.label).toBeTruthy();
                expect(link.pathname).toBeTruthy();
            });
        });

        test("should support nested pathnames", () => {
            const navLink: NavLink = {
                label: "Nested Page",
                pathname: "/blog/post-1",
            };

            expect(navLink.pathname).toBe("/blog/post-1");
        });
    });

    describe("SocialLink", () => {
        test("should have required fields", () => {
            const socialLink: SocialLink = {
                label: "GitHub",
                url: "https://github.com/user",
                icon: "github",
            };

            expect(socialLink.label).toBe("GitHub");
            expect(socialLink.url).toBe("https://github.com/user");
            expect(socialLink.icon).toBe("github");
        });

        test("should support different social platforms", () => {
            const socialLinks: SocialLink[] = [
                {
                    label: "GitHub",
                    url: "https://github.com/user",
                    icon: "github",
                },
                {
                    label: "LinkedIn",
                    url: "https://linkedin.com/in/user",
                    icon: "linkedin",
                },
                {
                    label: "Twitter",
                    url: "https://twitter.com/user",
                    icon: "twitter",
                },
            ];

            socialLinks.forEach((link) => {
                expect(link.label).toBeTruthy();
                expect(link.url).toMatch(/^https?:\/\//);
                expect(link.icon).toBeTruthy();
            });
        });

        test("should support custom icon names", () => {
            const socialLink: SocialLink = {
                label: "Custom Platform",
                url: "https://custom.com/user",
                icon: "custom-icon",
            };

            expect(socialLink.icon).toBe("custom-icon");
        });
    });
});
