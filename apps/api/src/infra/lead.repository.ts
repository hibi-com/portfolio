import { createPrismaClient } from "@portfolio/db";
import type { CreateLeadInput, Lead, LeadRepository, LeadStatus, UpdateLeadInput } from "~/domain/lead";

function toDateString(d: Date | null | undefined): string | undefined {
    if (d == null) return undefined;
    return d instanceof Date ? d.toISOString() : String(d);
}

export class LeadRepositoryImpl implements LeadRepository {
    constructor(private readonly databaseUrl?: string) {}

    private mapToLead(data: {
        id: string;
        customerId: string | null;
        name: string;
        email: string | null;
        phone: string | null;
        company: string | null;
        source: string | null;
        status: string;
        score: number | null;
        notes: string | null;
        convertedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }): Lead {
        return {
            id: data.id,
            customerId: data.customerId ?? undefined,
            name: data.name,
            email: data.email ?? undefined,
            phone: data.phone ?? undefined,
            company: data.company ?? undefined,
            source: data.source ?? undefined,
            status: data.status as LeadStatus,
            score: data.score ?? undefined,
            notes: data.notes ?? undefined,
            convertedAt: toDateString(data.convertedAt),
            createdAt: toDateString(data.createdAt) ?? "",
            updatedAt: toDateString(data.updatedAt) ?? "",
        };
    }

    async findAll(): Promise<Lead[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: "desc" },
        });

        return leads.map((lead) => this.mapToLead(lead));
    }

    async findById(id: string): Promise<Lead | null> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const lead = await prisma.lead.findUnique({
            where: { id },
        });

        if (!lead) return null;

        return this.mapToLead(lead);
    }

    async findByCustomerId(customerId: string): Promise<Lead[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const leads = await prisma.lead.findMany({
            where: { customerId },
            orderBy: { createdAt: "desc" },
        });

        return leads.map((lead) => this.mapToLead(lead));
    }

    async create(input: CreateLeadInput): Promise<Lead> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const lead = await prisma.lead.create({
            data: {
                customerId: input.customerId,
                name: input.name,
                email: input.email,
                phone: input.phone,
                company: input.company,
                source: input.source,
                status: input.status ?? "NEW",
                score: input.score,
                notes: input.notes,
            },
        });

        return this.mapToLead(lead);
    }

    async update(id: string, input: UpdateLeadInput): Promise<Lead> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const lead = await prisma.lead.update({
            where: { id },
            data: {
                customerId: input.customerId,
                name: input.name,
                email: input.email,
                phone: input.phone,
                company: input.company,
                source: input.source,
                status: input.status,
                score: input.score,
                notes: input.notes,
            },
        });

        return this.mapToLead(lead);
    }

    async delete(id: string): Promise<void> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        await prisma.lead.delete({
            where: { id },
        });
    }

    async convertToDeal(id: string): Promise<Lead> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const lead = await prisma.lead.update({
            where: { id },
            data: {
                status: "CONVERTED",
                convertedAt: new Date(),
            },
        });

        return this.mapToLead(lead);
    }
}
