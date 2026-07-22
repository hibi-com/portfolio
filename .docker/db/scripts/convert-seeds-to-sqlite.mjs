import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname, "../sql");

function convert(sql) {
    let s = sql;
    s = s.replace(/^USE\s+portfolio\s*;\s*\n?/gim, "");
    s = s.replace(
        /DATE_SUB\s*\(\s*NOW\s*\(\s*\)\s*,\s*INTERVAL\s+(\d+)\s+DAY\s*\)/gi,
        "datetime('now', '-$1 day')",
    );
    s = s.replace(
        /DATE_ADD\s*\(\s*NOW\s*\(\s*\)\s*,\s*INTERVAL\s+(\d+)\s+DAY\s*\)/gi,
        "datetime('now', '+$1 day')",
    );
    s = s.replace(
        /DATE_SUB\s*\(\s*NOW\s*\(\s*\)\s*,\s*INTERVAL\s+(\d+)\s+HOUR\s*\)/gi,
        "datetime('now', '-$1 hour')",
    );
    s = s.replace(
        /DATE_ADD\s*\(\s*NOW\s*\(\s*\)\s*,\s*INTERVAL\s+(\d+)\s+HOUR\s*\)/gi,
        "datetime('now', '+$1 hour')",
    );
    s = s.replace(
        /DATE_SUB\s*\(\s*NOW\s*\(\s*\)\s*,\s*INTERVAL\s+(\d+)\s+MINUTE\s*\)/gi,
        "datetime('now', '-$1 minute')",
    );
    s = s.replace(
        /DATE_ADD\s*\(\s*NOW\s*\(\s*\)\s*,\s*INTERVAL\s+(\d+)\s+MINUTE\s*\)/gi,
        "datetime('now', '+$1 minute')",
    );
    s = s.replace(
        /DATE_SUB\s*\(\s*NOW\s*\(\s*\)\s*,\s*INTERVAL\s+(\d+)\s+MONTH\s*\)/gi,
        "datetime('now', '-$1 month')",
    );
    s = s.replace(
        /DATE_ADD\s*\(\s*NOW\s*\(\s*\)\s*,\s*INTERVAL\s+(\d+)\s+MONTH\s*\)/gi,
        "datetime('now', '+$1 month')",
    );
    s = s.replace(
        /DATE_SUB\s*\(\s*NOW\s*\(\s*\)\s*,\s*INTERVAL\s+(\d+)\s+YEAR\s*\)/gi,
        "datetime('now', '-$1 year')",
    );
    s = s.replace(
        /DATE_ADD\s*\(\s*NOW\s*\(\s*\)\s*,\s*INTERVAL\s+(\d+)\s+YEAR\s*\)/gi,
        "datetime('now', '+$1 year')",
    );
    s = s.replace(/\bNOW\s*\(\s*\)/gi, "datetime('now')");
    s = s.replace(/\s*ON DUPLICATE KEY UPDATE[^;]*/gi, "");
    s = s.replace(/INSERT INTO/gi, "INSERT OR IGNORE INTO");
    s = s.replace(/`([^`]+)`/g, '"$1"');
    return s;
}

for (const name of fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    const file = path.join(dir, name);
    const before = fs.readFileSync(file, "utf8");
    const after = convert(before);
    fs.writeFileSync(file, after);
    console.log(`converted ${name}`);
}
