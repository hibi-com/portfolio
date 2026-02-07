#!/usr/bin/env bun

import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

export function findRootDir(startDir: string = process.cwd()): string {
    let currentDir = resolve(startDir);
    const root = resolve("/");

    while (currentDir !== root) {
        const packageJsonPath = join(currentDir, "package.json");
        const turboJsonPath = join(currentDir, "turbo.json");

        if (existsSync(packageJsonPath) && existsSync(turboJsonPath)) {
            return currentDir;
        }

        currentDir = resolve(currentDir, "..");
    }

    return process.cwd();
}
