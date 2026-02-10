import type { Prisma } from "@portfolio/db";
import { createPrismaClient } from "@portfolio/db";
import type { CreateDealInput, Deal, DealRepository, DealStatus, UpdateDealInput } from "~/domain/deal";

function toDateString(d: Date | null | undefined): string | undefined {
    if (d == null) return undefined;
    return d instanceof Date ? d.toISOString() : String(d);
}

export class DealRepositoryImpl implements DealRepository {
    constructor(private readonly databaseUrl?: string) {}

    private mapToDeal(data: {
        id: string;
        customerId: string | null;
        leadId: string | null;
        stageId: string;
        name: string;
        value: Prisma.Decimal | null;
        currency: string;
        expectedCloseDate: Date | null;
        actualCloseDate: Date | null;
        status: string;
        notes: string | null;
        lostReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }): Deal {
        return {
            id: data.id,
            customerId: data.customerId ?? undefined,
            leadId: data.leadId ?? undefined,
            stageId: data.stageId,
            name: data.name,
            value: data.value ? Number(data.value) : undefined,
            currency: data.currency,
            expectedCloseDate: toDateString(data.expectedCloseDate),
            actualCloseDate: toDateString(data.actualCloseDate),
            status: data.status as DealStatus,
            notes: data.notes ?? undefined,
            lostReason: data.lostReason ?? undefined,
            createdAt: toDateString(data.createdAt) ?? "",
            updatedAt: toDateString(data.updatedAt) ?? "",
        };
    }

    async findAll(): Promise<Deal[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const deals = await prisma.deal.findMany({
            orderBy: { createdAt: "desc" },
        });

        return deals.map((deal) => this.mapToDeal(deal));
    }

    async findById(id: string): Promise<Deal | null> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const deal = await prisma.deal.findUnique({
            where: { id },
        });

        if (!deal) return null;

        return this.mapToDeal(deal);
    }

    async findByCustomerId(customerId: string): Promise<Deal[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const deals = await prisma.deal.findMany({
            where: { customerId },
            orderBy: { createdAt: "desc" },
        });

        return deals.map((deal) => this.mapToDeal(deal));
    }

    async findByStageId(stageId: string): Promise<Deal[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const deals = await prisma.deal.findMany({
            where: { stageId },
            orderBy: { createdAt: "desc" },
        });

        return deals.map((deal) => this.mapToDeal(deal));
    }

    async create(input: CreateDealInput): Promise<Deal> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const deal = await prisma.deal.create({
            data: {
                customerId: input.customerId,
                leadId: input.leadId,
                stageId: input.stageId,
                name: input.name,
                value: input.value,
                currency: input.currency ?? "JPY",
                expectedCloseDate: input.expectedCloseDate,
                status: input.status ?? "OPEN",
                notes: input.notes,
            },
        });

        return this.mapToDeal(deal);
    }

    async update(id: string, input: UpdateDealInput): Promise<Deal> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const deal = await prisma.deal.update({
            where: { id },
            data: {
                customerId: input.customerId,
                stageId: input.stageId,
                name: input.name,
                value: input.value,
                currency: input.currency,
                expectedCloseDate: input.expectedCloseDate,
                actualCloseDate: input.actualCloseDate,
                status: input.status,
                notes: input.notes,
                lostReason: input.lostReason,
            },
        });

        return this.mapToDeal(deal);
    }

    async delete(id: string): Promise<void> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        await prisma.deal.delete({
            where: { id },
        });
    }

    async moveToStage(id: string, stageId: string): Promise<Deal> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const deal = await prisma.deal.update({
            where: { id },
            data: { stageId },
        });

        return this.mapToDeal(deal);
    }

    async markAsWon(id: string): Promise<Deal> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const deal = await prisma.deal.update({
            where: { id },
            data: {
                status: "WON",
                actualCloseDate: new Date(),
            },
        });

        return this.mapToDeal(deal);
    }

    async markAsLost(id: string, reason?: string): Promise<Deal> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const deal = await prisma.deal.update({
            where: { id },
            data: {
                status: "LOST",
                actualCloseDate: new Date(),
                lostReason: reason,
            },
        });

        return this.mapToDeal(deal);
    }
}
