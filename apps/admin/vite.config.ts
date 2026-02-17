/// <reference path="./env.d.ts" />
/// <reference types="./env.d.ts" />
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [
        react(),
        tanstackRouter({
            routesDirectory: "./app/routes",
            generatedRouteTree: "./app/routeTree.gen.tsx",
            routeFileIgnorePattern: ".test.",
        }),
        tsconfigPaths({
            ignoreConfigErrors: true,
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "~": resolve(__dirname, "./app"),
        },
    },
    ssr: {
        external: ["@sentry/node"],
    },
    build: {
        outDir: "build",
        rollupOptions: {
            external: (id) => {
                if (id === "@sentry/node" || id.startsWith("@sentry/node/")) {
                    return true;
                }
                return false;
            },
        },
    },
});
