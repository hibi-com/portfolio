import type { Context } from "hono";

export function parseBearerToken(c: Context): string | null {
    const auth = c.req.header("Authorization");
    if (!auth?.startsWith("Bearer ")) return null;
    return auth.slice(7);
}

export function requireAuth(c: Context): string | null {
    const token = parseBearerToken(c);
    if (!token) return null;
    return token;
}
