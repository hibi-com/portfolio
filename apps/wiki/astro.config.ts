import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import type { AstroIntegration } from "astro";
import { defineConfig } from "astro/config";
import mermaid from "astro-mermaid";

function copyStaticAssets(): AstroIntegration {
    return {
        name: "copy-static-assets",
        hooks: {
            "astro:build:done": ({ dir }) => {
                const outDir = dir.pathname;
                const uiDesignPath = resolve("design/ui");
                if (existsSync(uiDesignPath)) {
                    cpSync(uiDesignPath, resolve(outDir, "design"), {
                        recursive: true,
                    });
                }
                const webDesignPath = resolve("design/web");
                if (existsSync(webDesignPath)) {
                    cpSync(webDesignPath, resolve(outDir, "storybook"), {
                        recursive: true,
                    });
                }
                cpSync(resolve("reference"), resolve(outDir, "reference"), {
                    recursive: true,
                });
            },
        },
    };
}

const isPreview = process.argv.includes("preview");

export default defineConfig({
    site: "https://wiki.ageha734.jp",
    output: "static",
    adapter: isPreview ? undefined : cloudflare(),
    integrations: [
        react(),
        mermaid({
            theme: "default",
            autoTheme: true,
        }),
        copyStaticAssets(),
        starlight({
            title: "Portfolio Docs",
            defaultLocale: "root",
            locales: {
                root: {
                    label: "日本語",
                    lang: "ja",
                },
            },
            social: {
                github: "https://github.com/ageha734/portfolio",
            },
            sidebar: [
                {
                    label: "Architecture",
                    autogenerate: { directory: "architecture" },
                },
                {
                    label: "Development",
                    autogenerate: { directory: "development" },
                },
                {
                    label: "Sequence Diagrams",
                    items: [
                        {
                            label: "Web Pages",
                            items: [
                                {
                                    label: "Blog",
                                    autogenerate: { directory: "sequence/web/blog" },
                                },
                                {
                                    label: "Portfolio",
                                    autogenerate: { directory: "sequence/web/portfolio" },
                                },
                                {
                                    label: "API Routes",
                                    autogenerate: { directory: "sequence/web/api" },
                                },
                            ],
                        },
                        {
                            label: "Admin",
                            items: [
                                {
                                    label: "Dashboard",
                                    autogenerate: { directory: "sequence/admin/dashboard" },
                                },
                                {
                                    label: "Posts",
                                    autogenerate: { directory: "sequence/admin/posts" },
                                },
                                {
                                    label: "Portfolios",
                                    autogenerate: { directory: "sequence/admin/portfolios" },
                                },
                                {
                                    label: "CRM",
                                    autogenerate: { directory: "sequence/admin/crm" },
                                },
                                {
                                    label: "Inquiries",
                                    autogenerate: { directory: "sequence/admin/inquiries" },
                                },
                            ],
                        },
                        {
                            label: "Backend API",
                            items: [
                                {
                                    label: "Post",
                                    autogenerate: { directory: "sequence/api/post" },
                                },
                                {
                                    label: "Portfolio",
                                    autogenerate: { directory: "sequence/api/portfolio" },
                                },
                                {
                                    label: "CRM",
                                    autogenerate: { directory: "sequence/api/crm" },
                                },
                                {
                                    label: "Chat",
                                    autogenerate: { directory: "sequence/api/chat" },
                                },
                                {
                                    label: "Email",
                                    autogenerate: { directory: "sequence/api/email" },
                                },
                                {
                                    label: "Inquiry",
                                    autogenerate: { directory: "sequence/api/inquiry" },
                                },
                                {
                                    label: "Integration",
                                    autogenerate: { directory: "sequence/api/integration" },
                                },
                            ],
                        },
                    ],
                },
                {
                    label: "Specifications",
                    items: [
                        {
                            label: "API",
                            autogenerate: { directory: "specs/api" },
                        },
                        {
                            label: "Database",
                            autogenerate: { directory: "specs/db" },
                        },
                    ],
                },
                {
                    label: "User Stories",
                    items: [
                        {
                            label: "Overview",
                            link: "/user-stories/",
                        },
                        {
                            label: "Visitor",
                            autogenerate: { directory: "user-stories/visitor" },
                        },
                    ],
                },
                {
                    label: "Database",
                    autogenerate: { directory: "database" },
                },
                {
                    label: "Prompts",
                    link: "/prompts/",
                },
                {
                    label: "References",
                    items: [
                        {
                            label: "API Reference",
                            link: "/reference/",
                            attrs: { target: "_blank" },
                        },
                        {
                            label: "UI Components",
                            link: "/design/",
                            attrs: { target: "_blank" },
                        },
                        {
                            label: "Web Storybook",
                            link: "/storybook/",
                            attrs: { target: "_blank" },
                        },
                    ],
                },
                {
                    label: "Reports",
                    items: [
                        {
                            label: "E2E Test Reports",
                            link: "/reports/",
                        },
                        {
                            label: "Coverage Reports",
                            link: "/reports/coverage/",
                        },
                    ],
                },
            ],
            customCss: ["./src/styles/custom.css"],
        }),
    ],
});
