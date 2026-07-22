import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../sql");

function inlineMysqlVars(sql) {
    const vars = new Map();
    // Collect SET @name = 'value'; / SET @name = datetime(...);
    const setRe = /^SET\s+@(\w+)\s*=\s*(.+?)\s*;\s*$/gim;
    let m;
    while ((m = setRe.exec(sql)) !== null) {
        vars.set(m[1], m[2].trim());
    }

    // Remove SET lines
    let out = sql.replace(/^SET\s+@\w+\s*=\s*.+?;\s*$/gim, "");

    // Replace @name with values (longest names first)
    const names = [...vars.keys()].sort((a, b) => b.length - a.length);
    for (const name of names) {
        const value = vars.get(name);
        out = out.replaceAll(new RegExp(`@${name}\\b`, "g"), value);
    }
    // Clean excessive blank lines
    out = out.replace(/\n{3,}/g, "\n\n");
    return out;
}

for (const name of fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    const file = path.join(dir, name);
    const before = fs.readFileSync(file, "utf8");
    if (!/^SET\s+@/im.test(before) && !/@\w+/.test(before)) continue;
    const after = inlineMysqlVars(before);
    fs.writeFileSync(file, after);
    console.log(`inlined vars: ${name}`);
}
