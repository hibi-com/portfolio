import { defineConfig } from "prisma/config";

export default defineConfig({
    schema: "./prisma/schema",
    migrations: {
        path: "./migration",
    },
    datasource: {
        // Local default: libSQL (sqld) from `.docker/db` (host port 8081).
        // Production Workers use the D1 binding instead of DATABASE_URL.
        url: process.env.DATABASE_URL ?? "http://127.0.0.1:8081",
        shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL ?? "http://127.0.0.1:8081",
    },
});
