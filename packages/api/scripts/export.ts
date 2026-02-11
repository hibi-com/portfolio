import { readFileSync, writeFileSync } from "node:fs";

let content = readFileSync("generated/zod/schemas.ts", "utf-8");

content = content.replaceAll(/import \{ makeApi, Zodios, type ZodiosOptions \} from "@zodios\/core";\n/gm, "");
content = content.replaceAll("z.record(z.string())", "z.record(z.string(), z.string())");

const schemaNames: string[] = [];
const constRegex = /^const ([A-Z]\w*) = z/gm;
let match = constRegex.exec(content);
while (match !== null) {
    const name = match[1];
    if (name) {
        schemaNames.push(name);
    }
    match = constRegex.exec(content);
}

for (const name of schemaNames) {
    const exportConstRegex = new RegExp(String.raw`^const ${name} = z`, "gm");
    const arrayRefRegex = new RegExp(String.raw`z\.array(${name})`, "g");
    const refInContextRegex = new RegExp(String.raw`([:\s,])${name}([,.)\s])`, "g");
    content = content.replaceAll(exportConstRegex, `export const ${name}Schema = z`);
    content = content.replaceAll(arrayRefRegex, `z.array(${name}Schema)`);
    content = content.replaceAll(refInContextRegex, `$1${name}Schema$2`);
}

const typeExports = schemaNames.map((name) => `export type ${name} = z.infer<typeof ${name}Schema>;`).join("\n");

content = content.replace(/const endpoints = makeApi\(\[[\s\S]*?\]\);[\s\S]*$/, "");
content = content.replace(/^export const schemas = \{[\s\S]*?\};$/m, "");

const schemasObject = schemaNames.map((name) => `    ${name}: ${name}Schema,`).join("\n");

content = `${content.trim()}

export const schemas = {
${schemasObject}
};

// Type inference exports
${typeExports}
`;

writeFileSync("generated/zod/index.ts", content);

console.log(`Exported ${schemaNames.length} schemas:`);
schemaNames.slice(0, 15).forEach((name) => console.log(`  - ${name}`));
if (schemaNames.length > 15) {
    console.log(`  ... and ${schemaNames.length - 15} more`);
}
