#!/usr/bin/env bun

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const MIGRATION_DIR_NAME = "migration";
const SCHEMA_PATH_REL = "prisma/schema";
const USE_DATABASE = "USE portfolio;\n";
const MIGRATION_NAME = "migration";

function getTimestamp(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const h = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    return `${y}${m}${d}${h}${min}${s}`;
}

function hasExistingMigrations(migrationDir: string): boolean {
    if (!existsSync(migrationDir) || !readdirSync(migrationDir).length) {
        return false;
    }
    const entries = readdirSync(migrationDir, { withFileTypes: true });
    for (const e of entries) {
        if (!e.isDirectory()) continue;
        const sqlPath = join(migrationDir, e.name, "migration.sql");
        if (existsSync(sqlPath)) return true;
    }
    return false;
}

function runGenerate(dbDir: string): boolean {
    const r = spawnSync("bun", ["run", "generate"], {
        cwd: dbDir,
        stdio: "inherit",
        shell: false,
    });
    return r.status === 0;
}

function resolvePrismaBin(dbDir: string): string {
    const local = join(dbDir, "node_modules", ".bin", "prisma");
    if (existsSync(local)) return local;
    const root = join(dbDir, "..", "..", "node_modules", ".bin", "prisma");
    if (existsSync(root)) return resolve(root);
    return "prisma";
}

function runPrismaDiff(
    dbDir: string,
    fromEmpty: boolean,
    migrationDirRel: string,
    schemaPathRel: string,
    shadowDatabaseUrl?: string,
): { stdout: string; stderr: string; status: number | null } {
    const prismaBin = resolvePrismaBin(dbDir);
    const args: string[] = [
        "migrate",
        "diff",
        ...(fromEmpty ? ["--from-empty"] : ["--from-migrations", migrationDirRel]),
        "--to-schema-datamodel",
        schemaPathRel,
        "--script",
        ...(shadowDatabaseUrl ? ["--shadow-database-url", shadowDatabaseUrl] : []),
    ];

    const r = spawnSync(prismaBin, args, {
        cwd: dbDir,
        encoding: "utf-8",
        shell: false,
    });

    return {
        stdout: (r.stdout ?? "").trim(),
        stderr: (r.stderr ?? "").trim(),
        status: r.status,
    };
}

function deriveShadowUrl(databaseUrl: string): string | null {
    try {
        return databaseUrl.replace(/\/([^/?]+)(\?|$)/, "/$1_shadow$2");
    } catch {
        return null;
    }
}

function parseArgs(args: string[]): { dbDir: string; runGenerateFirst: boolean } {
    let dbDir = process.cwd();
    let runGenerateFirst = true;
    let i = 0;
    while (i < args.length) {
        const arg = args[i];
        if (arg === "--db-dir" && args[i + 1] !== undefined) {
            dbDir = resolve(args[i + 1]!);
            i += 2;
            continue;
        }
        if (arg === "--no-generate") {
            runGenerateFirst = false;
        }
        i++;
    }
    return { dbDir, runGenerateFirst };
}

function getShadowUrlOrError(fromEmpty: boolean): string | null {
    if (fromEmpty) return null;
    const url =
        process.env.SHADOW_DATABASE_URL ??
        (process.env.DATABASE_URL ? deriveShadowUrl(process.env.DATABASE_URL) : null);
    return url ?? null;
}

function writeMigration(migrationDir: string, sql: string): void {
    const ts = getTimestamp();
    const migrationSubdir = `${ts}_${MIGRATION_NAME}`;
    const outDir = join(migrationDir, migrationSubdir);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "migration.sql"), USE_DATABASE + sql, "utf-8");
    console.log(`Created: ${join(MIGRATION_DIR_NAME, migrationSubdir, "migration.sql")}`);
}

function main(): number {
    const { dbDir, runGenerateFirst } = parseArgs(process.argv.slice(2));
    const migrationDir = join(dbDir, MIGRATION_DIR_NAME);
    const schemaPath = join(dbDir, SCHEMA_PATH_REL);

    if (!existsSync(schemaPath)) {
        console.error(`prisma-migration: schema not found: ${schemaPath}`);
        return 1;
    }

    if (runGenerateFirst && !runGenerate(dbDir)) {
        console.error("prisma-migration: bun run generate failed");
        return 1;
    }

    mkdirSync(migrationDir, { recursive: true });
    const fromEmpty = !hasExistingMigrations(migrationDir);
    const shadowUrl = getShadowUrlOrError(fromEmpty);

    if (!fromEmpty && !shadowUrl) {
        console.error(
            "prisma-migration: 増分生成時は SHADOW_DATABASE_URL を設定するか、DATABASE_URL から派生できるようにしてください。",
        );
        return 1;
    }

    const { stdout, stderr, status } = runPrismaDiff(
        dbDir,
        fromEmpty,
        `./${MIGRATION_DIR_NAME}`,
        `./${SCHEMA_PATH_REL}`,
        shadowUrl ?? undefined,
    );

    if (status !== 0) {
        if (stderr) console.error(stderr);
        return status ?? 1;
    }

    const sql = stdout.trim();
    if (!sql) {
        console.log("差分がありません。新規マイグレーションは作成しませんでした。");
        return 0;
    }

    writeMigration(migrationDir, sql);
    return 0;
}

process.exit(main());
