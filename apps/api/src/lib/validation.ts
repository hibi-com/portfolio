export function isValidSlug(slug: string): boolean {
    if (!slug || slug.length === 0) {
        return false;
    }
    const slugPattern = /^[a-zA-Z0-9_-]+$/;
    return slugPattern.test(slug);
}

export function isValidUuid(uuid: string): boolean {
    if (!uuid || uuid.length === 0) {
        return false;
    }
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(uuid);
}

const ALLOWED_IMAGE_CONTENT_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;

export type AllowedImageContentType = (typeof ALLOWED_IMAGE_CONTENT_TYPES)[number];

export function isValidImageContentType(contentType: string): contentType is AllowedImageContentType {
    return ALLOWED_IMAGE_CONTENT_TYPES.includes(contentType as AllowedImageContentType);
}

const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"] as const;

export function isValidImageExtension(extension: string): boolean {
    const normalizedExt = extension.toLowerCase();
    return ALLOWED_IMAGE_EXTENSIONS.includes(normalizedExt as (typeof ALLOWED_IMAGE_EXTENSIONS)[number]);
}

export async function validateImageMagicBytes(bytes: Uint8Array): Promise<AllowedImageContentType | null> {
    if (bytes.length < 4) {
        return null;
    }

    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
        return "image/jpeg";
    }

    if (
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47 &&
        bytes.length >= 8 &&
        bytes[4] === 0x0d &&
        bytes[5] === 0x0a &&
        bytes[6] === 0x1a &&
        bytes[7] === 0x0a
    ) {
        return "image/png";
    }

    if (
        bytes[0] === 0x47 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x38 &&
        bytes.length >= 6 &&
        (bytes[4] === 0x37 || bytes[4] === 0x39) &&
        bytes[5] === 0x61
    ) {
        return "image/gif";
    }

    if (
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46 &&
        bytes.length >= 12 &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50
    ) {
        return "image/webp";
    }

    return null;
}

export function sanitizeFilename(filename: string): string {
    return filename.replaceAll("..", "").replaceAll(/[/\\]/g, "").replace(/^\.+/, "");
}

export function getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf(".");
    if (lastDot === -1 || lastDot === filename.length - 1) {
        return "";
    }
    return filename.substring(lastDot).toLowerCase();
}
