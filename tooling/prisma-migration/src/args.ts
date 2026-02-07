import { resolve } from "node:path";

export interface ParsedArgs {
    dbDir: string;
    runGenerateFirst: boolean;
}

export function parseArgs(args: string[]): ParsedArgs {
    let dbDir = process.cwd();
    let runGenerateFirst = true;
    let i = 0;
    while (i < args.length) {
        const arg = args[i];
        if (arg === "--db-dir" && args[i + 1] !== undefined) {
            dbDir = resolve(args[i + 1]!);
            i += 2;
            continue;
        }
        if (arg === "--no-generate") {
            runGenerateFirst = false;
        }
        i++;
    }
    return { dbDir, runGenerateFirst };
}
