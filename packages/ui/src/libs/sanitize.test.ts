import { beforeEach, describe, expect, test, vi } from "vitest";

describe("sanitizeHtml", () => {
    beforeEach(() => {
        vi.resetModules();
    });

    describe("Server-side (typeof window === 'undefined')", () => {
        test("should sanitize HTML on server-side", async () => {
            vi.stubGlobal("window", undefined);

            const { sanitizeHtml } = await import("./sanitize");

            const maliciousHtml = '<script>alert("XSS")</script><p>Safe content</p>';
            const result = sanitizeHtml(maliciousHtml);

            expect(result).not.toContain("<script>");
            expect(result).not.toContain("alert");
            expect(result).toContain("<p>Safe content</p>");
        });

        test("should remove dangerous event handlers on server-side", async () => {
            vi.stubGlobal("window", undefined);

            const { sanitizeHtml } = await import("./sanitize");

            const maliciousHtml = '<img src="x" onerror="alert(1)">';
            const result = sanitizeHtml(maliciousHtml);

            expect(result).not.toContain("onerror");
        });

        test("should allow safe tags and attributes on server-side", async () => {
            vi.stubGlobal("window", undefined);

            const { sanitizeHtml } = await import("./sanitize");

            const safeHtml = '<p class="text">Hello</p><a href="https://example.com" target="_blank">Link</a>';
            const result = sanitizeHtml(safeHtml);

            expect(result).toContain('<p class="text">Hello</p>');
            expect(result).toContain('href="https://example.com"');
        });
    });

    describe("Client-side (typeof window !== 'undefined')", () => {
        test("should sanitize HTML on client-side", async () => {
            vi.stubGlobal("window", {});

            const { sanitizeHtml } = await import("./sanitize");

            const maliciousHtml = '<script>alert("XSS")</script><p>Safe content</p>';
            const result = sanitizeHtml(maliciousHtml);

            expect(result).not.toContain("<script>");
            expect(result).toContain("<p>Safe content</p>");
        });
    });
});
