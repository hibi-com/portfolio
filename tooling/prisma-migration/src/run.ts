import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "./args.js";
import { MIGRATION_DIR_NAME, SCHEMA_PATH_REL } from "./constants.js";
import { hasExistingMigrations, writeMigration } from "./migration.js";
import { getMigrationDirRel, getSchemaPathRel, runGenerate, runPrismaDiff } from "./prisma.js";
import { getShadowUrlOrError } from "./shadow.js";

export function main(args: string[] = process.argv.slice(2)): number {
    const { dbDir, runGenerateFirst } = parseArgs(args);
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
        getMigrationDirRel(),
        getSchemaPathRel(),
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
