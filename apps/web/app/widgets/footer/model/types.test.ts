import { describe, expect, test } from "vitest";
import type { FooterConfig, FooterMobileProps, FooterProps, FooterSocialLink } from "./types";

describe("Footer Widget Types", () => {
    describe("FooterSocialLink", () => {
        test("should have required fields", () => {
            const socialLink: FooterSocialLink = {
                platform: "github",
                url: "https://github.com/user",
                alt: "GitHub profile",
                iconSrc: "/icons/github.svg",
            };

            expect(socialLink.platform).toBe("github");
            expect(socialLink.url).toBe("https://github.com/user");
            expect(socialLink.alt).toBe("GitHub profile");
            expect(socialLink.iconSrc).toBe("/icons/github.svg");
        });

        test("should support all platform types", () => {
            const platforms: FooterSocialLink["platform"][] = ["linkedin", "github", "twitter"];

            platforms.forEach((platform) => {
                const socialLink: FooterSocialLink = {
                    platform,
                    url: `https://${platform}.com/user`,
                    alt: `${platform} profile`,
                    iconSrc: `/icons/${platform}.svg`,
                };

                expect(socialLink.platform).toBe(platform);
            });
        });
    });

    describe("FooterConfig", () => {
        test("should support all optional fields", () => {
            const config: FooterConfig = {
                socialLinks: [
                    {
                        platform: "github",
                        url: "https://github.com/user",
                        alt: "GitHub",
                        iconSrc: "/icons/github.svg",
                    },
                ],
                footerText: "© 2024 Portfolio",
                location: "Tokyo, Japan",
                locationUrl: "https://maps.google.com",
                hideOnResume: true,
            };

            expect(config.socialLinks).toHaveLength(1);
            expect(config.footerText).toBe("© 2024 Portfolio");
            expect(config.location).toBe("Tokyo, Japan");
            expect(config.locationUrl).toBe("https://maps.google.com");
            expect(config.hideOnResume).toBe(true);
        });

        test("should work with empty config", () => {
            const config: FooterConfig = {};

            expect(config).toBeDefined();
        });

        test("should support multiple social links", () => {
            const config: FooterConfig = {
                socialLinks: [
                    {
                        platform: "github",
                        url: "https://github.com/user",
                        alt: "GitHub",
                        iconSrc: "/icons/github.svg",
                    },
                    {
                        platform: "linkedin",
                        url: "https://linkedin.com/in/user",
                        alt: "LinkedIn",
                        iconSrc: "/icons/linkedin.svg",
                    },
                ],
            };

            expect(config.socialLinks).toHaveLength(2);
        });
    });

    describe("FooterProps", () => {
        test("should support all optional fields", () => {
            const props: FooterProps = {
                config: {
                    footerText: "Footer text",
                },
                className: "custom-footer",
                forceShow: true,
            };

            expect(props.config).toBeDefined();
            expect(props.className).toBe("custom-footer");
            expect(props.forceShow).toBe(true);
        });

        test("should work without any fields", () => {
            const props: FooterProps = {};

            expect(props).toBeDefined();
        });
    });

    describe("FooterMobileProps", () => {
        test("should support all optional fields", () => {
            const props: FooterMobileProps = {
                config: {
                    footerText: "Mobile footer",
                },
                className: "mobile-footer",
                forceShow: false,
            };

            expect(props.config).toBeDefined();
            expect(props.className).toBe("mobile-footer");
            expect(props.forceShow).toBe(false);
        });

        test("should work without any fields", () => {
            const props: FooterMobileProps = {};

            expect(props).toBeDefined();
        });
    });
});
