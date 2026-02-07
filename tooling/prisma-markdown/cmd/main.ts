#!/usr/bin/env node

import * as fs from "node:fs";
import * as path from "node:path";
import pkg from "@prisma/generator-helper";
import type { Config } from "../src/config.js";
import { PrismaMarkdown } from "../src/markdown.js";

const { generatorHandler } = pkg;

const packageJson = await import("../package.json", { with: { type: "json" } });
const { version } = packageJson.default;

generatorHandler({
    onManifest: () => ({
        version,
        defaultOutput: "./ERD.md",
        prettyName: "prisma-markdown",
    }),

    onGenerate: async (options) => {
        const content: string = PrismaMarkdown.write(
            options.dmmf.datamodel,
            options.generator.config as Config | undefined,
        );
        const file: string = options.generator.output?.value ?? "./ERD.md";
        try {
            await fs.promises.mkdir(path.dirname(file), { recursive: true });
        } catch (error) {
            console.error(
                `[prisma-markdown] Failed to create output directory for ${file}:`,
                error instanceof Error ? error.message : String(error),
            );
            throw error;
        }
        await fs.promises.writeFile(file, content, "utf8");
    },
});
