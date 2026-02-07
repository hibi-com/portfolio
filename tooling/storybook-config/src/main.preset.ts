import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

export interface StorybookMainPresetOptions {
    stories: string[];
    rootDir?: string;
    additionalAliases?: Record<string, string>;
    additionalAddons?: string[];
}

function getPluginName(plugin: unknown): string {
    if (typeof plugin === "object" && plugin !== null && "name" in plugin) {
        const nameValue = (plugin as { name?: unknown }).name;
        return typeof nameValue === "string" ? nameValue : "";
    }
    if (typeof plugin === "function") {
        const fnNameValue = (plugin as { name?: unknown }).name;
        return typeof fnNameValue === "string" ? fnNameValue : "";
    }
    return "";
}

function shouldExcludeRemixPlugin(plugin: unknown): boolean {
    if (!plugin) return false;

    if (Array.isArray(plugin)) {
        const [pluginFn] = plugin;
        if (pluginFn) {
            const name = getPluginName(pluginFn);
            if (name.toLowerCase().includes("remix")) {
                return true;
            }
        }
        return false;
    }

    const name = getPluginName(plugin);
    return name.toLowerCase().includes("remix");
}

function filterRemixPlugins(plugins: unknown[]): unknown[] {
    return plugins.filter((plugin) => !shouldExcludeRemixPlugin(plugin));
}

export function createStorybookMainPreset(options: StorybookMainPresetOptions): StorybookConfig {
    const { stories, additionalAliases = {}, additionalAddons = [] } = options;

    const sentryNodeStubPath = fileURLToPath(new URL("./helper/sentry-stub.js", import.meta.url));

    const config: StorybookConfig = {
        stories,
        addons: [
            "@storybook/addon-essentials",
            "@storybook/addon-interactions",
            "@storybook/addon-links",
            "@storybook/addon-a11y",
            ...additionalAddons,
        ],
        framework: {
            name: "@storybook/react-vite",
            options: {},
        },
        core: {
            disableTelemetry: true,
        },
        viteFinal(config) {
            const filteredPlugins = filterRemixPlugins(config.plugins || []);

            return mergeConfig(
                {
                    ...config,
                    plugins: filteredPlugins,
                },
                {
                    resolve: {
                        alias: {
                            ...additionalAliases,
                            "@sentry/node": sentryNodeStubPath,
                        },
                    },
                    optimizeDeps: {
                        exclude: ["@sentry/node"],
                    },
                    server: {
                        watch: {
                            ignored: ["**/.cache/**", "**/docs/**"],
                        },
                    },
                },
            );
        },
    };

    return config;
}
