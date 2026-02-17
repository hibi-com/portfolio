import {
    COOKIE_THEME,
    MESSAGE_HIRE_ARTWORK,
    MESSAGE_HIRE_CONOSLE,
    SITE_AUTHOR,
    SITE_DESCRIPTION,
    SITE_EMAIL_ADDRESS,
    SITE_EMAIL_LINK,
    SITE_FACEBOOK,
    SITE_INSTAGRAM,
    SITE_SHARE_IMAGE,
    SITE_TITLE,
    SITE_UPDATED,
    SITE_URL,
    SITE_YEAR,
    SOCIAL_GITHUB,
    SOCIAL_LINKEDIN,
    SOCIAL_TWITTER,
} from "./constants";

describe("constants", () => {
    test("should export COOKIE_THEME", () => {
        expect(COOKIE_THEME).toBe("theme");
    });

    test("should export MESSAGE_HIRE_CONOSLE", () => {
        expect(MESSAGE_HIRE_CONOSLE).toBeTruthy();
        expect(typeof MESSAGE_HIRE_CONOSLE).toBe("string");
    });

    test("should export MESSAGE_HIRE_ARTWORK", () => {
        expect(MESSAGE_HIRE_ARTWORK).toBeTruthy();
        expect(typeof MESSAGE_HIRE_ARTWORK).toBe("string");
    });

    test("should export SITE_AUTHOR", () => {
        expect(SITE_AUTHOR).toBe("Matthew Scholta");
    });

    test("should export SITE_DESCRIPTION with SITE_AUTHOR", () => {
        expect(SITE_DESCRIPTION).toContain(SITE_AUTHOR);
        expect(SITE_DESCRIPTION).toBeTruthy();
    });

    test("should export SITE_EMAIL_ADDRESS", () => {
        expect(SITE_EMAIL_ADDRESS).toBe("matthew.scholta@gmail.com");
    });

    test("should export SITE_EMAIL_LINK with mailto prefix", () => {
        expect(SITE_EMAIL_LINK).toContain("mailto:");
        expect(SITE_EMAIL_LINK).toContain(SITE_EMAIL_ADDRESS);
    });

    test("should export SITE_FACEBOOK URL", () => {
        expect(SITE_FACEBOOK).toContain("facebook.com");
        expect(SITE_FACEBOOK).toMatch(/^https:\/\//);
    });

    test("should export SITE_INSTAGRAM URL", () => {
        expect(SITE_INSTAGRAM).toContain("instagram.com");
        expect(SITE_INSTAGRAM).toMatch(/^https:\/\//);
    });

    test("should export SITE_SHARE_IMAGE path", () => {
        expect(SITE_SHARE_IMAGE).toBe("/images/assets/share.jpg");
    });

    test("should export SITE_TITLE with SITE_AUTHOR", () => {
        expect(SITE_TITLE).toContain(SITE_AUTHOR);
        expect(SITE_TITLE).toBeTruthy();
    });

    test("should export SITE_UPDATED as Date", () => {
        expect(SITE_UPDATED).toBeInstanceOf(Date);
    });

    test("should export SITE_URL", () => {
        expect(SITE_URL).toBe("https://mattscholta.com");
    });

    test("should export SITE_YEAR as current year", () => {
        const currentYear = new Date().getFullYear();
        expect(SITE_YEAR).toBe(currentYear);
    });

    test("should export SOCIAL_GITHUB URL", () => {
        expect(SOCIAL_GITHUB).toContain("github.com");
        expect(SOCIAL_GITHUB).toMatch(/^https:\/\//);
    });

    test("should export SOCIAL_LINKEDIN URL", () => {
        expect(SOCIAL_LINKEDIN).toContain("linkedin.com");
        expect(SOCIAL_LINKEDIN).toMatch(/^https:\/\//);
    });

    test("should export SOCIAL_TWITTER URL", () => {
        expect(SOCIAL_TWITTER).toContain("twitter.com");
        expect(SOCIAL_TWITTER).toMatch(/^https:\/\//);
    });
});
