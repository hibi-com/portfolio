import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { MIGRATION_DIR_NAME, MIGRATION_NAME, MIGRATION_SQL_FILE, USE_DATABASE } from "./constants.js";
import { getTimestamp } from "./timestamp.js";

export function hasExistingMigrations(migrationDir: string): boolean {
    if (!existsSync(migrationDir)) return false;

    const entries = readdirSync(migrationDir, { withFileTypes: true });
    if (entries.length === 0) return false;

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const sqlPath = join(migrationDir, entry.name, MIGRATION_SQL_FILE);
        if (existsSync(sqlPath)) return true;
    }

    return false;
}

export function writeMigration(migrationDir: string, sql: string): string {
    const timestamp = getTimestamp();
    const migrationSubdir = `${timestamp}_${MIGRATION_NAME}`;
    const outDir = join(migrationDir, migrationSubdir);

    mkdirSync(outDir, { recursive: true });

    const sqlContent = USE_DATABASE + sql;
    const sqlPath = join(outDir, MIGRATION_SQL_FILE);

    Bun.write(sqlPath, sqlContent);

    const relativePath = join(MIGRATION_DIR_NAME, migrationSubdir, MIGRATION_SQL_FILE);
    console.log(`Created: ${relativePath}`);

    return relativePath;
}
