import { createPrismaClient } from "@portfolio/db";
import type {
    CreatePipelineInput,
    CreatePipelineStageInput,
    Pipeline,
    PipelineRepository,
    PipelineStage,
    UpdatePipelineInput,
    UpdatePipelineStageInput,
} from "~/domain/pipeline";

export class PipelineRepositoryImpl implements PipelineRepository {
    constructor(private readonly databaseUrl?: string) {}

    private mapToStage(data: {
        id: string;
        pipelineId: string;
        name: string;
        order: number;
        probability: number | null;
        color: string | null;
        createdAt: Date;
        updatedAt: Date;
    }): PipelineStage {
        return {
            id: data.id,
            pipelineId: data.pipelineId,
            name: data.name,
            order: data.order,
            probability: data.probability ?? undefined,
            color: data.color ?? undefined,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }

    private mapToPipeline(
        data: {
            id: string;
            name: string;
            description: string | null;
            isDefault: boolean;
            createdAt: Date;
            updatedAt: Date;
        },
        stages: PipelineStage[] = [],
    ): Pipeline {
        return {
            id: data.id,
            name: data.name,
            description: data.description ?? undefined,
            isDefault: data.isDefault,
            stages,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }

    async findAll(): Promise<Pipeline[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const pipelines = await prisma.pipeline.findMany({
            include: { stages: { orderBy: { order: "asc" } } },
            orderBy: { createdAt: "desc" },
        });

        return pipelines.map((pipeline) =>
            this.mapToPipeline(pipeline, pipeline.stages.map((stage) => this.mapToStage(stage))),
        );
    }

    async findById(id: string): Promise<Pipeline | null> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const pipeline = await prisma.pipeline.findUnique({
            where: { id },
            include: { stages: { orderBy: { order: "asc" } } },
        });

        if (!pipeline) return null;

        return this.mapToPipeline(pipeline, pipeline.stages.map((stage) => this.mapToStage(stage)));
    }

    async findDefault(): Promise<Pipeline | null> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const pipeline = await prisma.pipeline.findFirst({
            where: { isDefault: true },
            include: { stages: { orderBy: { order: "asc" } } },
        });

        if (!pipeline) return null;

        return this.mapToPipeline(pipeline, pipeline.stages.map((stage) => this.mapToStage(stage)));
    }

    async create(input: CreatePipelineInput): Promise<Pipeline> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });

        if (input.isDefault) {
            await prisma.pipeline.updateMany({
                where: { isDefault: true },
                data: { isDefault: false },
            });
        }

        const pipeline = await prisma.pipeline.create({
            data: {
                name: input.name,
                description: input.description,
                isDefault: input.isDefault ?? false,
            },
            include: { stages: true },
        });

        return this.mapToPipeline(pipeline, []);
    }

    async update(id: string, input: UpdatePipelineInput): Promise<Pipeline> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });

        if (input.isDefault) {
            await prisma.pipeline.updateMany({
                where: { isDefault: true, id: { not: id } },
                data: { isDefault: false },
            });
        }

        const pipeline = await prisma.pipeline.update({
            where: { id },
            data: {
                name: input.name,
                description: input.description,
                isDefault: input.isDefault,
            },
            include: { stages: { orderBy: { order: "asc" } } },
        });

        return this.mapToPipeline(pipeline, pipeline.stages.map((stage) => this.mapToStage(stage)));
    }

    async delete(id: string): Promise<void> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        await prisma.pipeline.delete({
            where: { id },
        });
    }

    async createStage(input: CreatePipelineStageInput): Promise<PipelineStage> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const stage = await prisma.pipelineStage.create({
            data: {
                pipelineId: input.pipelineId,
                name: input.name,
                order: input.order,
                probability: input.probability,
                color: input.color,
            },
        });

        return this.mapToStage(stage);
    }

    async updateStage(id: string, input: UpdatePipelineStageInput): Promise<PipelineStage> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const stage = await prisma.pipelineStage.update({
            where: { id },
            data: {
                name: input.name,
                order: input.order,
                probability: input.probability,
                color: input.color,
            },
        });

        return this.mapToStage(stage);
    }

    async deleteStage(id: string): Promise<void> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        await prisma.pipelineStage.delete({
            where: { id },
        });
    }

    async findStageById(id: string): Promise<PipelineStage | null> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const stage = await prisma.pipelineStage.findUnique({
            where: { id },
        });

        if (!stage) return null;

        return this.mapToStage(stage);
    }
}
