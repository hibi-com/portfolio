import { defineConfig } from "prisma/config";

function deriveShadowUrl(url: string): string {
    return url.replace(/\/([^/?]+)(\?|$)/, "/$1_shadow$2");
}

export default defineConfig({
    schema: "./prisma/schema",
    migrations: {
        path: "./migration",
    },
    datasource: {
        url: process.env.DATABASE_URL ?? "",
        shadowDatabaseUrl:
            process.env.SHADOW_DATABASE_URL ??
            (process.env.DATABASE_URL ? deriveShadowUrl(process.env.DATABASE_URL) : undefined),
    },
});
