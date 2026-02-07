export function deriveShadowUrl(databaseUrl: string): string | null {
    try {
        return databaseUrl.replace(/\/([^/?]+)(\?|$)/, "/$1_shadow$2");
    } catch {
        return null;
    }
}

export function getShadowUrlOrError(fromEmpty: boolean): string | null {
    if (fromEmpty) return null;
    const url =
        process.env.SHADOW_DATABASE_URL ??
        (process.env.DATABASE_URL ? deriveShadowUrl(process.env.DATABASE_URL) : null);
    return url ?? null;
}
