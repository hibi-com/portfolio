import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    createPrismaClient,
    type InquiryCategory,
    type InquiryStatus,
    type PrismaClient,
    resetPrismaInstance,
} from "@portfolio/db";

let prisma: PrismaClient | null = null;

/** Host URL for Docker Compose libSQL (`sqlite` published on 8081). */
const DEFAULT_DOCKER_LIBSQL_URL = "http://127.0.0.1:8081";

function getTestDatabaseUrl(): string {
    return process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || DEFAULT_DOCKER_LIBSQL_URL;
}

function getInitMigrationPath(): string {
    return path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../../../../packages/db/migration/20260723000000_init_sqlite/migration.sql",
    );
}

async function hasSchema(client: PrismaClient): Promise<boolean> {
    try {
        await client.$queryRawUnsafe(`SELECT 1 FROM posts LIMIT 1`);
        return true;
    } catch {
        return false;
    }
}

async function applySchema(client: PrismaClient): Promise<void> {
    if (await hasSchema(client)) {
        return;
    }

    const migrationPath = getInitMigrationPath();
    if (!fs.existsSync(migrationPath)) {
        throw new Error(`SQLite init migration not found: ${migrationPath}`);
    }

    const sql = fs.readFileSync(migrationPath, "utf8");
    const statements = sql
        .replace(/--[^\n]*/g, "")
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    for (const statement of statements) {
        await client.$executeRawUnsafe(statement);
    }
}

export async function setupTestDb(): Promise<PrismaClient> {
    const databaseUrl = getTestDatabaseUrl();

    prisma = createPrismaClient({ databaseUrl });
    await prisma.$connect();
    await applySchema(prisma);

    return prisma;
}

export async function teardownTestDb(): Promise<void> {
    if (prisma) {
        await prisma.$disconnect();
        prisma = null;
    }
    resetPrismaInstance();
}

export async function clearTestDb(): Promise<void> {
    if (!prisma) {
        throw new Error("Database not initialized. Call setupTestDb first.");
    }

    const tableNames = [
        "post_tags",
        "post_images",
        "portfolio_images",
        "contact_histories",
        "chat_messages",
        "chat_participants",
        "chat_rooms",
        "inquiry_responses",
        "inquiries",
        "email_logs",
        "email_templates",
        "customer_freee_mappings",
        "deal_freee_mappings",
        "freee_sync_logs",
        "freee_integrations",
        "deals",
        "pipeline_stages",
        "pipelines",
        "leads",
        "customers",
        "tags",
        "posts",
        "portfolios",
    ];

    for (const tableName of tableNames) {
        try {
            await prisma.$executeRawUnsafe(`DELETE FROM ${tableName}`);
        } catch {
            // Table does not exist, ignore
        }
    }
}

export interface TestSeedData {
    posts?: Array<{
        id: string;
        title: string;
        slug: string;
        content?: string;
        description?: string;
        imageTemp?: string;
        sticky?: boolean;
        date?: Date;
    }>;
    portfolios?: Array<{
        id: string;
        title: string;
        slug: string;
        company?: string;
        description?: string;
        thumbnailTemp?: string;
        date?: Date;
    }>;
    customers?: Array<{
        id: string;
        name: string;
        email?: string;
        phone?: string;
        company?: string;
        status?: "ACTIVE" | "INACTIVE" | "PROSPECT" | "CHURNED";
    }>;
    leads?: Array<{
        id: string;
        name: string;
        email?: string;
        customerId?: string;
        status?: "NEW" | "CONTACTED" | "QUALIFIED" | "UNQUALIFIED" | "CONVERTED";
        source?: string;
    }>;
    pipelines?: Array<{
        id: string;
        name: string;
        description?: string;
        isDefault?: boolean;
        stages?: Array<{ id: string; name: string; order: number; probability?: number }>;
    }>;
    deals?: Array<{
        id: string;
        name: string;
        customerId?: string;
        leadId?: string;
        stageId: string;
        value?: number;
        status?: "OPEN" | "WON" | "LOST" | "STALLED";
    }>;
    inquiries?: Array<{
        id: string;
        customerId?: string;
        subject: string;
        content: string;
        category?: string;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
        status?: string;
    }>;
}

async function seedPosts(rows: NonNullable<TestSeedData["posts"]>): Promise<void> {
    for (const post of rows) {
        await prisma!.post.create({
            data: {
                id: post.id,
                title: post.title,
                slug: post.slug,
                content: post.content ?? "",
                description: post.description,
                imageTemp: post.imageTemp ?? "",
                sticky: post.sticky ?? false,
                date: post.date ?? new Date(),
            },
        });
    }
}

async function seedPortfolios(rows: NonNullable<TestSeedData["portfolios"]>): Promise<void> {
    for (const portfolio of rows) {
        await prisma!.portfolio.create({
            data: {
                id: portfolio.id,
                title: portfolio.title,
                slug: portfolio.slug,
                company: portfolio.company ?? "",
                description: portfolio.description,
                thumbnailTemp: portfolio.thumbnailTemp,
                date: portfolio.date ?? new Date(),
            },
        });
    }
}

async function seedCustomers(rows: NonNullable<TestSeedData["customers"]>): Promise<void> {
    for (const customer of rows) {
        await prisma!.customer.create({
            data: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                company: customer.company,
                status: customer.status ?? "PROSPECT",
            },
        });
    }
}

async function seedPipelines(rows: NonNullable<TestSeedData["pipelines"]>): Promise<void> {
    for (const pipeline of rows) {
        await prisma!.pipeline.create({
            data: {
                id: pipeline.id,
                name: pipeline.name,
                description: pipeline.description,
                isDefault: pipeline.isDefault ?? false,
                stages: pipeline.stages
                    ? {
                          create: pipeline.stages.map((s) => ({
                              id: s.id,
                              name: s.name,
                              order: s.order,
                              probability: s.probability,
                          })),
                      }
                    : undefined,
            },
        });
    }
}

async function seedLeads(rows: NonNullable<TestSeedData["leads"]>): Promise<void> {
    for (const lead of rows) {
        await prisma!.lead.create({
            data: {
                id: lead.id,
                name: lead.name,
                email: lead.email,
                customerId: lead.customerId,
                status: lead.status ?? "NEW",
                source: lead.source,
            },
        });
    }
}

async function seedDeals(rows: NonNullable<TestSeedData["deals"]>): Promise<void> {
    for (const deal of rows) {
        await prisma!.deal.create({
            data: {
                id: deal.id,
                name: deal.name,
                customerId: deal.customerId,
                leadId: deal.leadId,
                stageId: deal.stageId,
                value: deal.value,
                status: deal.status ?? "OPEN",
            },
        });
    }
}

async function seedInquiries(rows: NonNullable<TestSeedData["inquiries"]>): Promise<void> {
    for (const inquiry of rows) {
        await prisma!.inquiry.create({
            data: {
                id: inquiry.id,
                customerId: inquiry.customerId,
                subject: inquiry.subject,
                content: inquiry.content,
                category: (inquiry.category ?? "GENERAL") as InquiryCategory,
                priority: inquiry.priority ?? "MEDIUM",
                status: (inquiry.status ?? "OPEN") as InquiryStatus,
            },
        });
    }
}

export async function seedTestData(data: TestSeedData): Promise<void> {
    if (!prisma) {
        throw new Error("Database not initialized. Call setupTestDb first.");
    }
    if (data.posts) await seedPosts(data.posts);
    if (data.portfolios) await seedPortfolios(data.portfolios);
    if (data.customers) await seedCustomers(data.customers);
    if (data.pipelines) await seedPipelines(data.pipelines);
    if (data.leads) await seedLeads(data.leads);
    if (data.deals) await seedDeals(data.deals);
    if (data.inquiries) await seedInquiries(data.inquiries);
}

export function getPrismaClient(): PrismaClient {
    if (!prisma) throw new Error("Database not initialized. Call setupTestDb first.");
    return prisma;
}

export function getTestDatabaseUrlForContainer(): string {
    return getTestDatabaseUrl();
}
