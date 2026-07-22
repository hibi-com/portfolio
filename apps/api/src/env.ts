import type { D1Database, DurableObjectNamespace, KVNamespace, R2Bucket } from "@cloudflare/workers-types";

export type Env = {
    DB?: D1Database;
    CACHE?: KVNamespace;
    IMAGES?: R2Bucket;
    R2_PUBLIC_URL?: string;
    DATABASE_URL?: string;
    CACHE_URL?: string;
    NODE_ENV: string;
    SENTRY_DSN?: string;
    APP_VERSION?: string;
    BETTER_AUTH_URL?: string;
    BETTER_AUTH_SECRET?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    CORS_ORIGINS?: string;
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;
    CHAT_ROOMS?: DurableObjectNamespace;
    FREEE_CLIENT_ID?: string;
    FREEE_CLIENT_SECRET?: string;
    FREEE_AUTH_BASE_URL?: string;
    FREEE_API_BASE_URL?: string;
};
