import { readFileSync, writeFileSync } from "node:fs";

// 生成されたファイルを読み込み
let content = readFileSync("generated/zod/schemas.ts", "utf-8");

// Zodios 関連のインポートを削除
content = content.replace(
	/import \{ makeApi, Zodios, type ZodiosOptions \} from "@zodios\/core";\n/,
	"",
);

// 大文字で始まる const 宣言を export const に変換
// パターン1: const Name = z.enum (同じ行)
// パターン2: const Name = z\n  .object (次の行)
content = content.replace(/^const ([A-Z][A-Za-z0-9_]*) = z([.\n])/gm, "export const $1 = z$2");

// Zod v4 互換: z.record(z.string()) -> z.record(z.string(), z.string())
content = content.replace(/z\.record\(z\.string\(\)\)/g, "z.record(z.string(), z.string())");

// 型エクスポートを追加するためにスキーマ名を収集
const schemaNames: string[] = [];
// export const Name = z で始まる行を探す
const constRegex = /^export const ([A-Z][A-Za-z0-9_]*) = z/gm;
let match: RegExpExecArray | null;

while ((match = constRegex.exec(content)) !== null) {
	const name = match[1];
	if (name) {
		schemaNames.push(name);
	}
}

// 型推論エクスポートを生成
const typeExports = schemaNames
	.map((name) => `export type ${name}Type = z.infer<typeof ${name}>;`)
	.join("\n");

// Zodios クライアント関連のコードを削除
content = content.replace(/const endpoints = makeApi\(\[[\s\S]*?\]\);[\s\S]*$/, "");

// 型エクスポートを追加
content = `${content.trim()}\n\n// Type inference exports\n${typeExports}\n`;

// index.ts として保存
writeFileSync("generated/zod/index.ts", content);

console.log(`Exported ${schemaNames.length} schemas:`);
schemaNames.slice(0, 15).forEach((name) => console.log(`  - ${name}`));
if (schemaNames.length > 15) {
	console.log(`  ... and ${schemaNames.length - 15} more`);
}
