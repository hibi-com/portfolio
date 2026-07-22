/**
 * Apply Prisma migration SQL + seed SQL to a running sqld (libSQL HTTP).
 * Env: DATABASE_URL (default http://sqlite:8080)
 */
import fs from "node:fs";
import path from "node:path";

const baseUrl = (process.env.DATABASE_URL || "http://sqlite:8080").replace(/\/$/, "");
const migrationDir = process.env.MIGRATION_DIR || "/migration";
const sqlDir = process.env.SQL_DIR || "/sql";

async function waitHealthy(timeoutMs = 60000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            const res = await fetch(`${baseUrl}/health`);
            if (res.ok) return;
        } catch {
            // retry
        }
        await Bun.sleep(500);
    }
    throw new Error(`sqld not healthy at ${baseUrl}/health`);
}

async function executeSql(sql, label = "sql") {
    const withoutComments = sql.replace(/--[^\n]*/g, "");
    const statements = withoutComments
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    for (const stmt of statements) {
        const res = await fetch(`${baseUrl}/v2/pipeline`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                requests: [{ type: "execute", stmt: { sql: stmt } }, { type: "close" }],
            }),
        });
        const body = await res.json();
        if (!res.ok) {
            throw new Error(`[${label}] HTTP ${res.status}: ${JSON.stringify(body)}\nSTMT: ${stmt.slice(0, 200)}`);
        }
        const results = body?.results ?? [];
        for (const r of results) {
            if (r?.type === "error" || r?.response?.type === "error") {
                throw new Error(`[${label}] ${JSON.stringify(r)}\nSTMT: ${stmt.slice(0, 200)}`);
            }
        }
    }
}

async function alreadySeeded() {
    try {
        const res = await fetch(`${baseUrl}/v2/pipeline`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                requests: [
                    { type: "execute", stmt: { sql: 'SELECT 1 FROM "user" LIMIT 1' } },
                    { type: "close" },
                ],
            }),
        });
        const body = await res.json();
        const first = body?.results?.[0];
        return first?.response?.type === "ok" || first?.type === "ok";
    } catch {
        return false;
    }
}

function listSqlFiles(dir, pattern) {
    if (!fs.existsSync(dir)) return [];
    const files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...listSqlFiles(full, pattern));
        } else if (pattern.test(entry.name)) {
            files.push(full);
        }
    }
    return files.sort();
}

await waitHealthy();
console.log(`Connected to ${baseUrl}`);

if (await alreadySeeded()) {
    console.log("DB already initialized; skipping setup-db.");
    process.exit(0);
}

const migrations = listSqlFiles(migrationDir, /^migration\.sql$/);
console.log(`Applying ${migrations.length} migration file(s)...`);
for (const file of migrations) {
    console.log(`  -> ${file}`);
    await executeSql(fs.readFileSync(file, "utf8"), file);
}

const seeds = listSqlFiles(sqlDir, /\.sql$/).filter((f) => path.basename(f).match(/^\d/));
console.log(`Applying ${seeds.length} seed file(s)...`);
for (const file of seeds) {
    console.log(`  -> ${file}`);
    await executeSql(fs.readFileSync(file, "utf8"), file);
}

console.log("SQLite schema and seed completed via libSQL HTTP");
