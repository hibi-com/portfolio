import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { MIGRATION_DIR_NAME, SCHEMA_PATH_REL } from "./constants.js";

export function resolvePrismaBin(dbDir: string): string {
    const local = join(dbDir, "node_modules", ".bin", "prisma");
    if (existsSync(local)) return local;
    const root = join(dbDir, "..", "..", "node_modules", ".bin", "prisma");
    if (existsSync(root)) return resolve(root);
    return "prisma";
}

export function runGenerate(dbDir: string): boolean {
    const r = spawnSync("bun", ["run", "generate"], {
        cwd: dbDir,
        stdio: "inherit",
        shell: false,
    });
    return r.status === 0;
}

export interface PrismaDiffResult {
    stdout: string;
    stderr: string;
    status: number | null;
}

export function runPrismaDiff(
    dbDir: string,
    fromEmpty: boolean,
    migrationDirRel: string,
    schemaPathRel: string,
    shadowDatabaseUrl?: string,
): PrismaDiffResult {
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

export function getMigrationDirRel(): string {
    return `./${MIGRATION_DIR_NAME}`;
}

export function getSchemaPathRel(): string {
    return `./${SCHEMA_PATH_REL}`;
}
