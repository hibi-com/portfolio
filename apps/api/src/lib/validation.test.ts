import { describe, expect, test } from "vitest";
import {
    isValidImageContentType,
    isValidImageExtension,
    isValidSlug,
    isValidUuid,
    sanitizeFilename,
    validateImageMagicBytes,
} from "./validation";

describe("Validation Utilities", () => {
    describe("isValidSlug", () => {
        test("should accept valid slugs", () => {
            expect(isValidSlug("my-portfolio")).toBe(true);
            expect(isValidSlug("portfolio_2024")).toBe(true);
            expect(isValidSlug("Portfolio123")).toBe(true);
            expect(isValidSlug("a")).toBe(true);
        });

        test("should reject invalid slugs", () => {
            expect(isValidSlug("")).toBe(false);
            expect(isValidSlug("../etc/passwd")).toBe(false);
            expect(isValidSlug("slug with spaces")).toBe(false);
            expect(isValidSlug("slug/with/slashes")).toBe(false);
            expect(isValidSlug("<script>alert(1)</script>")).toBe(false);
        });
    });

    describe("isValidUuid", () => {
        test("should accept valid UUIDs", () => {
            expect(isValidUuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
            expect(isValidUuid("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
        });

        test("should reject invalid UUIDs", () => {
            expect(isValidUuid("")).toBe(false);
            expect(isValidUuid("not-a-uuid")).toBe(false);
            expect(isValidUuid("550e8400-e29b-41d4-a716")).toBe(false);
            expect(isValidUuid("550e8400e29b41d4a716446655440000")).toBe(false);
            expect(isValidUuid("../../../etc/passwd")).toBe(false);
        });
    });

    describe("isValidImageContentType", () => {
        test("should accept valid image content types", () => {
            expect(isValidImageContentType("image/jpeg")).toBe(true);
            expect(isValidImageContentType("image/png")).toBe(true);
            expect(isValidImageContentType("image/gif")).toBe(true);
            expect(isValidImageContentType("image/webp")).toBe(true);
        });

        test("should reject invalid content types", () => {
            expect(isValidImageContentType("image/svg+xml")).toBe(false);
            expect(isValidImageContentType("text/html")).toBe(false);
            expect(isValidImageContentType("application/javascript")).toBe(false);
            expect(isValidImageContentType("image/*")).toBe(false);
        });
    });

    describe("isValidImageExtension", () => {
        test("should accept valid image extensions", () => {
            expect(isValidImageExtension(".jpg")).toBe(true);
            expect(isValidImageExtension(".jpeg")).toBe(true);
            expect(isValidImageExtension(".png")).toBe(true);
            expect(isValidImageExtension(".gif")).toBe(true);
            expect(isValidImageExtension(".webp")).toBe(true);
            expect(isValidImageExtension(".JPG")).toBe(true);
            expect(isValidImageExtension(".PNG")).toBe(true);
        });

        test("should reject invalid extensions", () => {
            expect(isValidImageExtension(".svg")).toBe(false);
            expect(isValidImageExtension(".html")).toBe(false);
            expect(isValidImageExtension(".js")).toBe(false);
            expect(isValidImageExtension(".php")).toBe(false);
            expect(isValidImageExtension("")).toBe(false);
        });
    });

    describe("validateImageMagicBytes", () => {
        test("should detect JPEG magic bytes", async () => {
            const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
            expect(await validateImageMagicBytes(jpegBytes)).toBe("image/jpeg");
        });

        test("should detect PNG magic bytes", async () => {
            const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
            expect(await validateImageMagicBytes(pngBytes)).toBe("image/png");
        });

        test("should detect GIF magic bytes", async () => {
            const gif87Bytes = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]);
            const gif89Bytes = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
            expect(await validateImageMagicBytes(gif87Bytes)).toBe("image/gif");
            expect(await validateImageMagicBytes(gif89Bytes)).toBe("image/gif");
        });

        test("should detect WebP magic bytes", async () => {
            const webpBytes = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]);
            expect(await validateImageMagicBytes(webpBytes)).toBe("image/webp");
        });

        test("should return null for unknown or malicious content", async () => {
            const textBytes = new Uint8Array([0x3c, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74]);
            const randomBytes = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
            expect(await validateImageMagicBytes(textBytes)).toBeNull();
            expect(await validateImageMagicBytes(randomBytes)).toBeNull();
        });
    });

    describe("sanitizeFilename", () => {
        test("should sanitize dangerous characters", () => {
            expect(sanitizeFilename("file.jpg")).toBe("file.jpg");
            expect(sanitizeFilename("../../../etc/passwd")).toBe("etcpasswd");
            expect(sanitizeFilename("file/with/slashes.jpg")).toBe("filewithslashes.jpg");
            expect(sanitizeFilename(String.raw`file\with\backslashes.jpg`)).toBe("filewithbackslashes.jpg");
        });

        test("should preserve valid filenames", () => {
            expect(sanitizeFilename("my-image_2024.jpg")).toBe("my-image_2024.jpg");
            expect(sanitizeFilename("image123.png")).toBe("image123.png");
        });

        test("should handle edge cases", () => {
            expect(sanitizeFilename("")).toBe("");
            expect(sanitizeFilename("...")).toBe("");
            expect(sanitizeFilename("./file.jpg")).toBe("file.jpg");
        });
    });
});
