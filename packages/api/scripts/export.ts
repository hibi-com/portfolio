import { readFileSync, writeFileSync } from "node:fs";

let content = readFileSync("generated/zod/schemas.ts", "utf-8");

content = content.replaceAll(/import \{ makeApi, Zodios, type ZodiosOptions \} from "@zodios\/core";\n/gm, "");
content = content.replaceAll("z.record(z.string())", "z.record(z.string(), z.string())");

// スキーマ名を収集
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

// 各スキーマ名への参照を Schema サフィックス付きに変換
// 定義部分: const XXX = z... → export const XXXSchema = z...
for (const name of schemaNames) {
    // 定義を変換
    content = content.replace(new RegExp(`^const ${name} = z`, "gm"), `export const ${name}Schema = z`);
    // 参照を変換（z.array(XXX) など）
    content = content.replace(new RegExp(`z\\.array\\(${name}\\)`, "g"), `z.array(${name}Schema)`);
    // 単独参照を変換（XXX, や XXX.optional() など）
    content = content.replace(new RegExp(`([:\\s,])${name}([,.)\\s])`, "g"), `$1${name}Schema$2`);
    content = content.replace(new RegExp(`([:\\s,])${name}([,.)\\s])`, "g"), `$1${name}Schema$2`);
}

const typeExports = schemaNames
    .map((name) => `export type ${name} = z.infer<typeof ${name}Schema>;`)
    .join("\n");

// endpoints と既存の schemas オブジェクトを削除
content = content.replace(/const endpoints = makeApi\(\[[\s\S]*?\]\);[\s\S]*$/, "");
content = content.replace(/^export const schemas = \{[\s\S]*?\};$/gm, "");

// 新しい schemas オブジェクトを作成
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
