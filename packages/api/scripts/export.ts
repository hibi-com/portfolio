import { readFileSync, writeFileSync } from "node:fs";

let content = readFileSync("generated/zod/schemas.ts", "utf-8");

content = content.replaceAll(/import \{ makeApi, Zodios, type ZodiosOptions \} from "@zodios\/core";\n/gm, "");
content = content.replaceAll(/^const ([A-Z]\w*) = z([.\n])/gm, "export const $1 = z$2");
content = content.replaceAll("z.record(z.string())", "z.record(z.string(), z.string())");

const schemaNames: string[] = [];
const constRegex = /^export const ([A-Z]\w*) = z/gm;
let match = constRegex.exec(content);
while (match !== null) {
    const name = match[1];
    if (name) {
        schemaNames.push(name);
    }
    match = constRegex.exec(content);
}

const typeExports = schemaNames.map((name) => `export type ${name}Type = z.infer<typeof ${name}>;`).join("\n");

content = content.replace(/const endpoints = makeApi\(\[[\s\S]*?\]\);[\s\S]*$/, "");
content = `${content.trim()}\n\n// Type inference exports\n${typeExports}\n`;

writeFileSync("generated/zod/index.ts", content);

console.log(`Exported ${schemaNames.length} schemas:`);
schemaNames.slice(0, 15).forEach((name) => console.log(`  - ${name}`));
if (schemaNames.length > 15) {
    console.log(`  ... and ${schemaNames.length - 15} more`);
}
