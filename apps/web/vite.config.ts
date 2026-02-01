/// <reference path="./env.d.ts" />
/// <reference types="./env.d.ts" />
import { resolve } from "node:path";
// @ts-expect-error - No type definitions available
import rehypePrism from "@mapbox/rehype-prism";
import mdx from "@mdx-js/rollup";
import { createViteConfig } from "@portfolio/vite-config";
import { vitePlugin as remix, cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from "@remix-run/dev";
import tailwindcss from "@tailwindcss/vite";
import rehypeImgSize from "rehype-img-size";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig, mergeConfig } from "vite";

const isStorybook = process.argv.some((arg) => arg.includes("storybook"));

const baseConfig = createViteConfig({
    root: __dirname,
    tsconfigPath: "./tsconfig.json",
    additionalAliases: {
        "@xstate/inspect": resolve(__dirname, "./app/shared/mocks/xstate-inspect.ts"),
    },
});

export default mergeConfig(
    baseConfig,
    defineConfig({
        define: {
            "import.meta.env.SENTRY_DSN": JSON.stringify(process.env.SENTRY_DSN ?? "__undefined__"),
        },
        assetsInclude: ["**/*.glb", "**/*.hdr", "**/*.glsl"],
        ssr: {
            external: ["@sentry/node"],
        },
        build: {
            assetsInlineLimit: 1024,
            target: "es2022",
            rollupOptions: {
                external: (id) => {
                    if (id === "@xstate/inspect") {
                        return true;
                    }
                    if (id === "@sentry/node" || id.startsWith("@sentry/node/")) {
                        return true;
                    }
                    return false;
                },
            },
        },
        optimizeDeps: {
            exclude: ["@xstate/inspect"],
        },
        plugins: [
            tailwindcss(),
            mdx({
                rehypePlugins: [[rehypeImgSize, { dir: "public" }], rehypeSlug, rehypePrism] as never,
                remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] as never,
                providerImportSource: "@mdx-js/react",
            }),
            !isStorybook && remixCloudflareDevProxy(),
            !isStorybook &&
                remix({
                    ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
                    future: {
                        v3_fetcherPersist: true,
                        v3_relativeSplatPath: true,
                        v3_throwAbortReason: true,
                        v3_singleFetch: true,
                        v3_lazyRouteDiscovery: true,
                    },
                    serverModuleFormat: "esm",
                }),
        ].filter(Boolean),
    }),
);
