const config = {
    entry: [
        "apps/web/entry.client.tsx",
        "apps/web/entry.server.tsx",
        "apps/**/app/**/*.{ts,tsx}",
        "apps/**/functions/[[path]].ts",
        "apps/**/public/worker.js",
        "apps/**/vite.config.ts",
        "apps/**/vitest.config.ts",
        "apps/**/playwright.config.ts",
        "apps/**/playwright.storybook.config.ts",
        "apps/**/astro.config.ts",
        "packages/**/src/**/*.{ts,tsx}",
        "packages/**/index.ts",
        "tooling/**/*.{ts,tsx}",
        "testing/**/*.{ts,tsx}",
        "generators/**/*.{ts,tsx}",
        "scripts/**/*.{ts,tsx}",
    ],
    project: [
        "apps/**/*.{ts,tsx}",
        "packages/**/*.{ts,tsx}",
        "tooling/**/*.{ts,tsx}",
        "testing/**/*.{ts,tsx}",
        "scripts/**/*.{ts,tsx}",
    ],
    ignore: [
        "build/**",
        "dist/**",
        "node_modules/**",
        ".astro/**",
        ".cache/**",
        ".turbo/**",
        ".wrangler/**",
        ".coverage/**",
        ".results/**",
        "apps/**/public/**",
        "results/**",
        "report/**",
    ],
    ignoreDependencies: ["@types/bun", "@types/node", "@types/prismjs", "@types/react", "@types/react-dom"],
    ignoreBinaries: ["wrangler", "playwright", "storybook", "tsp", "orval", "check", "env", "setup"],
    workspaces: {
        "packages/ui": {
            storybook: {
                config: ".storybook/main.ts",
            },
        },
        "apps/admin": {
            storybook: {
                config: ".storybook/main.ts",
            },
        },
        "apps/api": {
            hono: {
                config: "hono.config.ts",
            },
        },
        "apps/e2e": {
            remix: {
                entry: ["e2e/entry.client.tsx", "e2e/entry.server.tsx"],
            },
        },
        "apps/web": {
            remix: {
                entry: ["app/entry.client.tsx", "app/entry.server.tsx"],
            },
        },
        "apps/wiki": {
            astro: {
                config: "astro.config.ts",
            },
        },
    },
};

export default config;
