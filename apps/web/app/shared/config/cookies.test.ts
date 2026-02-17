import { parseCookieHeader } from "./cookies";

describe("cookies", () => {
    test("should parse simple cookie string", () => {
        const result = parseCookieHeader("theme=dark");

        expect(result).toEqual({ theme: "dark" });
    });

    test("should parse multiple cookies", () => {
        const result = parseCookieHeader("theme=dark; lang=en");

        expect(result).toEqual({ theme: "dark", lang: "en" });
    });

    test("should decode URI encoded values", () => {
        const result = parseCookieHeader("name=John%20Doe; email=test%40example.com");

        expect(result).toEqual({ name: "John Doe", email: "test@example.com" });
    });

    test("should trim whitespace", () => {
        const result = parseCookieHeader(" theme = dark ; lang = en ");

        expect(result).toEqual({ theme: "dark", lang: "en" });
    });

    test("should handle empty string", () => {
        const result = parseCookieHeader("");

        expect(result).toHaveProperty("");
    });

    test("should handle cookies without values", () => {
        const result = parseCookieHeader("theme=; lang=en");

        expect(result).toEqual({ theme: "", lang: "en" });
    });

    test("should handle cookies without keys", () => {
        const result = parseCookieHeader("=value; lang=en");

        expect(result).toEqual({ "": "value", lang: "en" });
    });
});
