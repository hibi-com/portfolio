import { initAuth } from "@portfolio/auth";
import type { Context } from "hono";

export async function authenticate(ctx: Context): Promise<{ userId: string } | null> {
    const env = ctx.env;
    const baseUrl = env.BETTER_AUTH_URL || "http://localhost:8787";
    const productionUrl = env.BETTER_AUTH_URL || "http://localhost:8787";
    const secret = env.BETTER_AUTH_SECRET;
    const googleClientId = env.GOOGLE_CLIENT_ID || "";
    const googleClientSecret = env.GOOGLE_CLIENT_SECRET || "";
    const databaseUrl = env.DATABASE_URL;

    if (!secret) {
        return null;
    }

    const auth = initAuth({
        baseUrl,
        productionUrl,
        secret,
        googleClientId,
        googleClientSecret,
        databaseUrl,
    });

    const session = await auth.api.getSession({
        headers: ctx.req.raw.headers,
    });

    return session?.user ? { userId: session.user.id } : null;
}
