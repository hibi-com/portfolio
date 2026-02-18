import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ChangesetData } from "./types.js";

function generateRandomId(): string {
    const adjectives = ["happy", "quick", "bright", "calm", "brave", "clever", "kind", "wise", "proud", "cool"];
    const nouns = ["dogs", "cats", "trees", "stars", "waves", "birds", "lions", "bears", "clouds", "rocks"];
    const verbs = ["run", "jump", "fly", "swim", "dance", "sing", "play", "grow", "shine", "bloom"];

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];

    return `${adj}-${noun}-${verb}`;
}

export function generateChangesetContent(data: ChangesetData): string {
    const frontmatter = data.packages.map((pkg) => `"${pkg}": ${data.versionType}`).join("\n");

    return `---
${frontmatter}
---

${data.category}: ${data.summary}
`;
}

export async function writeChangesetFile(rootDir: string, data: ChangesetData): Promise<string> {
    const fileName = `${generateRandomId()}.md`;
    const filePath = join(rootDir, ".changeset", fileName);
    const content = generateChangesetContent(data);

    await writeFile(filePath, content, "utf-8");

    return filePath;
}
