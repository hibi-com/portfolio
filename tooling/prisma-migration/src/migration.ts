import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { MIGRATION_DIR_NAME, MIGRATION_NAME, USE_DATABASE } from "./constants.js";
import { getTimestamp } from "./timestamp.js";

export function hasExistingMigrations(migrationDir: string): boolean {
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

export function writeMigration(migrationDir: string, sql: string): void {
    const ts = getTimestamp();
    const migrationSubdir = `${ts}_${MIGRATION_NAME}`;
    const outDir = join(migrationDir, migrationSubdir);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "migration.sql"), USE_DATABASE + sql, "utf-8");
    console.log(`Created: ${join(MIGRATION_DIR_NAME, migrationSubdir, "migration.sql")}`);
}
