import { describe, expect, test } from "vitest";
import { sanitizeHtml } from "./sanitize";

describe("sanitizeHtml", () => {
    test("should sanitize HTML and keep safe content", () => {
        const maliciousHtml = '<script>alert("XSS")</script><p>Safe content</p>';
        const result = sanitizeHtml(maliciousHtml);

        expect(result).not.toContain("<script>");
        expect(result).not.toContain("alert");
        expect(result).toContain("<p>Safe content</p>");
    });

    test("should remove dangerous event handlers", () => {
        const maliciousHtml = '<img src="x" onerror="alert(1)">';
        const result = sanitizeHtml(maliciousHtml);

        expect(result).not.toContain("onerror");
    });

    test("should allow safe tags and attributes", () => {
        const safeHtml =
            '<p class="text">Hello</p><a href="https://example.com" target="_blank">Link</a>';
        const result = sanitizeHtml(safeHtml);

        expect(result).toContain('<p class="text">Hello</p>');
        expect(result).toContain('href="https://example.com"');
    });
});
