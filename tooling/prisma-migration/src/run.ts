import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "./lib/args.js";
import { MIGRATION_DIR_NAME, SCHEMA_PATH_REL } from "./lib/constants.js";
import { hasExistingMigrations, writeMigration } from "./lib/migration.js";
import { getMigrationDirRel, getSchemaPathRel, runGenerate, runPrismaDiff } from "./lib/prisma.js";
import { getShadowUrl } from "./lib/shadow.js";

const EXIT_SUCCESS = 0;
const EXIT_FAILURE = 1;

export function main(args: string[] = process.argv.slice(2)): number {
    const { dbDir, runGenerateFirst } = parseArgs(args);
    const migrationDir = join(dbDir, MIGRATION_DIR_NAME);
    const schemaPath = join(dbDir, SCHEMA_PATH_REL);

    if (!existsSync(schemaPath)) {
        console.error(`prisma-migration: schema not found: ${schemaPath}`);
        return EXIT_FAILURE;
    }

    if (runGenerateFirst && !runGenerate(dbDir)) {
        console.error("prisma-migration: bun run generate failed");
        return EXIT_FAILURE;
    }

    mkdirSync(migrationDir, { recursive: true });

    const fromEmpty = !hasExistingMigrations(migrationDir);
    const shadowUrl = getShadowUrl(fromEmpty);

    if (!fromEmpty && !shadowUrl) {
        console.error(
            "prisma-migration: 増分生成時は SHADOW_DATABASE_URL を設定するか、DATABASE_URL から派生できるようにしてください。",
        );
        return EXIT_FAILURE;
    }

    const { stdout, stderr, exitCode } = runPrismaDiff(
        dbDir,
        fromEmpty,
        getMigrationDirRel(),
        getSchemaPathRel(),
        shadowUrl ?? undefined,
    );

    if (exitCode !== 0) {
        if (stderr) console.error(stderr);
        return exitCode;
    }

    const sql = stdout.trim();
    if (!sql) {
        console.log("差分がありません。新規マイグレーションは作成しませんでした。");
        return EXIT_SUCCESS;
    }

    writeMigration(migrationDir, sql);
    return EXIT_SUCCESS;
}
