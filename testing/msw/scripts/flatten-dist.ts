#!/usr/bin/env bun
/**
 * bun build が entry の src/ を維持して dist/src に出す場合があるため、
 * package.json exports（./dist/index.js）に合わせてフラット化する。
 */
import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const nested = join(root, "dist", "src");
const dist = join(root, "dist");

if (!existsSync(nested)) {
    process.exit(0);
}

cpSync(nested, dist, { recursive: true });
rmSync(nested, { recursive: true, force: true });
