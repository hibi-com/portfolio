import { createPrismaClient, type PrismaClient, resetPrismaInstance } from "@portfolio/db";

let prisma: PrismaClient | null = null;

function getTestDatabaseUrl(): string {
    return process.env.TEST_DATABASE_URL || "file::memory:?cache=shared";
}

export async function setupTestDb(): Promise<PrismaClient> {
    const databaseUrl = getTestDatabaseUrl();

    prisma = createPrismaClient({ databaseUrl });
    await prisma.$connect();

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
            // テーブルが存在しない場合は無視
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

export async function seedTestData(data: TestSeedData): Promise<void> {
    if (!prisma) {
        throw new Error("Database not initialized. Call setupTestDb first.");
    }

    if (data.posts) {
        for (const post of data.posts) {
            await prisma.post.create({
                data: {
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    content: post.content || "",
                    description: post.description,
                    imageTemp: post.imageTemp || "",
                    sticky: post.sticky || false,
                    date: post.date || new Date(),
                },
            });
        }
    }

    if (data.portfolios) {
        for (const portfolio of data.portfolios) {
            await prisma.portfolio.create({
                data: {
                    id: portfolio.id,
                    title: portfolio.title,
                    slug: portfolio.slug,
                    company: portfolio.company || "",
                    description: portfolio.description,
                    thumbnailTemp: portfolio.thumbnailTemp,
                    date: portfolio.date || new Date(),
                },
            });
        }
    }

    if (data.customers) {
        for (const customer of data.customers) {
            await prisma.customer.create({
                data: {
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                    company: customer.company,
                    status: customer.status || "PROSPECT",
                },
            });
        }
    }

    if (data.pipelines) {
        for (const pipeline of data.pipelines) {
            await prisma.pipeline.create({
                data: {
                    id: pipeline.id,
                    name: pipeline.name,
                    description: pipeline.description,
                    isDefault: pipeline.isDefault || false,
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

    if (data.leads) {
        for (const lead of data.leads) {
            await prisma.lead.create({
                data: {
                    id: lead.id,
                    name: lead.name,
                    email: lead.email,
                    customerId: lead.customerId,
                    status: lead.status || "NEW",
                    source: lead.source,
                },
            });
        }
    }

    if (data.deals) {
        for (const deal of data.deals) {
            await prisma.deal.create({
                data: {
                    id: deal.id,
                    name: deal.name,
                    customerId: deal.customerId,
                    leadId: deal.leadId,
                    stageId: deal.stageId,
                    value: deal.value,
                    status: deal.status || "OPEN",
                },
            });
        }
    }

    if (data.inquiries) {
        for (const inquiry of data.inquiries) {
            await prisma.inquiry.create({
                data: {
                    id: inquiry.id,
                    customerId: inquiry.customerId,
                    subject: inquiry.subject,
                    content: inquiry.content,
                    category: inquiry.category || "GENERAL",
                    priority: inquiry.priority || "MEDIUM",
                    status: inquiry.status || "OPEN",
                },
            });
        }
    }
}

export function getPrismaClient(): PrismaClient {
    if (!prisma) throw new Error("Database not initialized. Call setupTestDb first.");
    return prisma;
}

export function getTestDatabaseUrlForContainer(): string {
    return getTestDatabaseUrl();
}
