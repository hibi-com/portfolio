import type { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../../generated/prisma/client.js";

export interface CreatePrismaClientOptions {
    d1?: D1Database;
    databaseUrl?: string;
}

let prismaInstance: PrismaClient | null = null;

function createAdapter(options: CreatePrismaClientOptions) {
    if (options.d1) {
        return new PrismaD1(options.d1);
    }

    const url = options.databaseUrl ?? process.env.DATABASE_URL;
    if (!url) {
        throw new Error("d1 binding, DATABASE_URL, or databaseUrl option is required");
    }

    const isLibsqlUrl =
        url.startsWith("file:") ||
        url.startsWith("libsql:") ||
        url.startsWith("http://") ||
        url.startsWith("https://");
    if (!isLibsqlUrl) {
        throw new Error(
            `Unsupported databaseUrl for SQLite/D1: ${url}. Expected file:, libsql:, http://, or https:// URL`,
        );
    }

    // PrismaLibSql accepts @libsql/client Config ({ url, authToken, ... })
    return new PrismaLibSql({ url });
}

export function createPrismaClient(options: CreatePrismaClientOptions = {}): PrismaClient {
    if (prismaInstance) {
        return prismaInstance;
    }

    const adapter = createAdapter(options);
    prismaInstance = new PrismaClient({ adapter });

    return prismaInstance;
}

export type PrismaClientType = ReturnType<typeof createPrismaClient>;

export function resetPrismaInstance(): void {
    prismaInstance = null;
}
