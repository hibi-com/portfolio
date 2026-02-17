import { initAuth } from "@portfolio/auth";

if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET environment variable is required");
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth credentials are required");
}

export const auth = initAuth({
    baseUrl: process.env.BASE_URL,
    productionUrl: process.env.PRODUCTION_URL,
    secret: process.env.AUTH_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
});

export async function requireAuth(request: Request) {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
        throw new Response("Unauthorized", {
            status: 401,
            headers: {
                Location: "/login",
            },
        });
    }

    return session;
}
