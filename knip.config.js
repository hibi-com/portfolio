const config = {
    entry: [
        "apps/web/entry.client.tsx",
        "apps/web/entry.server.tsx",
        "apps/**/app/**/*.{ts,tsx}",
        "apps/**/functions/[[path]].ts",
        "apps/**/public/worker.js",
        "apps/**/src/index.ts",
        "apps/**/scripts/**/*.{ts,tsx}",
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
        "apps/**/worker-configuration.d.ts",
    ],
    ignoreDependencies: ["@types/bun", "@types/node", "@types/prismjs", "@types/react", "@types/react-dom"],
    ignoreBinaries: ["wrangler", "playwright", "storybook", "tsp", "orval", "check", "env", "setup", "biome"],
    ignoreUnresolved: ["vitest/globals"],
    // knip 設定が未整備のため、ゲートは設定エラー回避と依存関係整合に限定
    rules: {
        files: "off",
        exports: "off",
        types: "off",
        nsExports: "off",
        nsTypes: "off",
        duplicates: "off",
        enumMembers: "off",
        classMembers: "off",
        unlisted: "off",
        binaries: "off",
        unresolved: "off",
        dependencies: "off",
        devDependencies: "off",
        optionalPeerDependencies: "off",
    },
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
        "apps/scenario": {
            remix: {
                entry: ["app/entry.client.tsx", "app/entry.server.tsx"],
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
