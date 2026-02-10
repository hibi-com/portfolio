import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { MIGRATION_DIR_NAME, SCHEMA_PATH_REL } from "./constants.js";

export interface PrismaDiffResult {
    stdout: string;
    stderr: string;
    exitCode: number;
}

function resolvePrismaBin(dbDir: string): string {
    const localBin = join(dbDir, "node_modules", ".bin", "prisma");
    if (existsSync(localBin)) return localBin;

    const rootBin = resolve(dbDir, "..", "..", "node_modules", ".bin", "prisma");
    if (existsSync(rootBin)) return rootBin;

    return "prisma";
}

export function runGenerate(dbDir: string): boolean {
    const result = Bun.spawnSync(["bun", "run", "generate"], {
        cwd: dbDir,
        stdio: ["inherit", "inherit", "inherit"],
    });
    return result.exitCode === 0;
}

export function runPrismaDiff(
    dbDir: string,
    fromEmpty: boolean,
    migrationDirRel: string,
    schemaPathRel: string,
    shadowDatabaseUrl?: string,
): PrismaDiffResult {
    const prismaBin = resolvePrismaBin(dbDir);

    const env =
        shadowDatabaseUrl === undefined ? process.env : { ...process.env, SHADOW_DATABASE_URL: shadowDatabaseUrl };

    const args: string[] = [
        prismaBin,
        "migrate",
        "diff",
        ...(fromEmpty ? ["--from-empty"] : ["--from-migrations", migrationDirRel]),
        "--to-schema-datamodel",
        schemaPathRel,
        "--script",
    ];

    const result = Bun.spawnSync(args, {
        cwd: dbDir,
        stdio: ["inherit", "pipe", "pipe"],
        env,
    });

    return {
        stdout: result.stdout.toString().trim(),
        stderr: result.stderr.toString().trim(),
        exitCode: result.exitCode,
    };
}

export function getMigrationDirRel(): string {
    return `./${MIGRATION_DIR_NAME}`;
}

export function getSchemaPathRel(): string {
    return `./${SCHEMA_PATH_REL}`;
}
