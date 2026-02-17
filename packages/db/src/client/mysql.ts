import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client.js";

export interface CreatePrismaClientOptions {
    databaseUrl?: string;
}

let prismaInstance: PrismaClient | null = null;

export function createPrismaClient(options: CreatePrismaClientOptions = {}): PrismaClient {
    if (prismaInstance) {
        return prismaInstance;
    }

    const url = options.databaseUrl ?? process.env.DATABASE_URL;
    if (!url) {
        throw new Error("DATABASE_URL or databaseUrl option is required");
    }

    const adapter = new PrismaMariaDb(url);
    prismaInstance = new PrismaClient({ adapter });

    return prismaInstance;
}

export type PrismaClientType = ReturnType<typeof createPrismaClient>;

export function resetPrismaInstance(): void {
    prismaInstance = null;
}
