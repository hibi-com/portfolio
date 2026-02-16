import * as fs from "node:fs";
import * as path from "node:path";

export async function createFileLinks(sourceDir: string, targetDir: string, suffix: string): Promise<void> {
    if (fs.existsSync(targetDir) && fs.lstatSync(targetDir).isSymbolicLink()) {
        fs.unlinkSync(targetDir);
    }

    fs.mkdirSync(targetDir, { recursive: true });

    const existingFiles = fs.readdirSync(targetDir).filter((f) => f.endsWith(".md"));
    for (const file of existingFiles) {
        fs.unlinkSync(path.join(targetDir, file));
    }

    const files = fs
        .readdirSync(sourceDir)
        .filter((f) => f.endsWith(".md") && fs.statSync(path.join(sourceDir, f)).isFile());

    for (const file of files) {
        const filename = path.basename(file, ".md");
        const sourceFile = path.join(sourceDir, file);
        const relativePath = path.relative(targetDir, sourceFile);
        const targetFile = path.join(targetDir, `${filename}${suffix}.md`);

        fs.symlinkSync(relativePath, targetFile);
    }
}

export async function createSkillLinks(sourceSkills: string, targetSkills: string, filename: string): Promise<void> {
    if (fs.existsSync(targetSkills) && fs.lstatSync(targetSkills).isSymbolicLink()) {
        fs.unlinkSync(targetSkills);
    }

    fs.mkdirSync(targetSkills, { recursive: true });

    const existingItems = fs.readdirSync(targetSkills);
    for (const item of existingItems) {
        const itemPath = path.join(targetSkills, item);
        const stat = fs.lstatSync(itemPath);
        if (stat.isDirectory()) {
            fs.rmSync(itemPath, { recursive: true, force: true });
        } else if (item.endsWith(".md")) {
            fs.unlinkSync(itemPath);
        }
    }

    const skillDirs = fs.readdirSync(sourceSkills).filter((f) => fs.statSync(path.join(sourceSkills, f)).isDirectory());

    for (const skillName of skillDirs) {
        const skillFile = path.join(sourceSkills, skillName, filename);
        if (fs.existsSync(skillFile)) {
            const targetSkillDir = path.join(targetSkills, skillName);
            fs.mkdirSync(targetSkillDir, { recursive: true });

            const relativePath = path.relative(targetSkillDir, skillFile);
            const targetFile = path.join(targetSkillDir, filename);

            fs.symlinkSync(relativePath, targetFile);
        }
    }
}

export function countFiles(dir: string, pattern: string): number {
    if (!fs.existsSync(dir)) return 0;

    let count = 0;
    const walk = (currentDir: string) => {
        const items = fs.readdirSync(currentDir);
        for (const item of items) {
            const itemPath = path.join(currentDir, item);
            const stat = fs.lstatSync(itemPath);

            if (stat.isDirectory()) {
                walk(itemPath);
            } else if (new RegExp(pattern.replaceAll("*", ".*")).exec(item)) {
                count++;
            }
        }
    };
    walk(dir);
    return count;
}
