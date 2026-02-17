import { artwork } from "./artwork";
import {
    MESSAGE_HIRE_CONOSLE,
    SITE_AUTHOR,
    SITE_EMAIL_ADDRESS,
    SITE_YEAR,
    SOCIAL_GITHUB,
    SOCIAL_LINKEDIN,
    SOCIAL_TWITTER,
} from "./constants";

describe("artwork", () => {
    test("should export artwork string", () => {
        expect(artwork).toBeTruthy();
        expect(typeof artwork).toBe("string");
    });

    test("should contain MESSAGE_HIRE_CONOSLE", () => {
        expect(artwork).toContain(MESSAGE_HIRE_CONOSLE);
    });

    test("should contain SITE_AUTHOR", () => {
        expect(artwork).toContain(SITE_AUTHOR);
    });

    test("should contain SITE_EMAIL_ADDRESS", () => {
        expect(artwork).toContain(SITE_EMAIL_ADDRESS);
    });

    test("should contain SITE_YEAR", () => {
        expect(artwork).toContain(SITE_YEAR.toString());
    });

    test("should contain SOCIAL_GITHUB", () => {
        expect(artwork).toContain(SOCIAL_GITHUB);
    });

    test("should contain SOCIAL_LINKEDIN", () => {
        expect(artwork).toContain(SOCIAL_LINKEDIN);
    });

    test("should contain SOCIAL_TWITTER", () => {
        expect(artwork).toContain(SOCIAL_TWITTER);
    });

    test("should contain HTML comment markers", () => {
        expect(artwork).toContain("<!--");
        expect(artwork).toContain("-->");
    });
});
