import { resolve } from "node:path";

export interface ParsedArgs {
    dbDir: string;
    runGenerateFirst: boolean;
}

const FLAG_DB_DIR = "--db-dir";
const FLAG_NO_GENERATE = "--no-generate";

export function parseArgs(args: string[]): ParsedArgs {
    let dbDir = process.cwd();
    let runGenerateFirst = true;

    let i = 0;
    while (i < args.length) {
        const arg = args[i];

        if (arg === FLAG_DB_DIR) {
            const nextArg = args[i + 1];
            if (nextArg !== undefined) {
                dbDir = resolve(nextArg);
                i += 2;
                continue;
            }
            i += 1;
            continue;
        }

        if (arg === FLAG_NO_GENERATE) {
            runGenerateFirst = false;
        }
        i += 1;
    }

    return { dbDir, runGenerateFirst };
}
