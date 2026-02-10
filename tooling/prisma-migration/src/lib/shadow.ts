const SHADOW_SUFFIX = "_shadow";

export function deriveShadowUrl(databaseUrl: string): string | null {
    try {
        return databaseUrl.replace(/\/([^/?]+)(\?|$)/, `/$1${SHADOW_SUFFIX}$2`);
    } catch {
        return null;
    }
}

export function getShadowUrl(fromEmpty: boolean): string | null {
    if (fromEmpty) return null;

    const shadowUrl = process.env.SHADOW_DATABASE_URL;
    if (shadowUrl) return shadowUrl;

    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) return deriveShadowUrl(databaseUrl);

    return null;
}
