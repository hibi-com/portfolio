import { z } from "zod";

export const pipelineStageSchema = z.object({
    id: z.string().min(1),
    pipelineId: z.string().min(1),
    name: z.string().min(1),
    order: z.number().int().min(0),
    probability: z.number().min(0).max(100).optional(),
    color: z.string().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const pipelineSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    isDefault: z.boolean(),
    stages: z.array(pipelineStageSchema),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const createPipelineInputSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    isDefault: z.boolean().optional(),
});

export const updatePipelineInputSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    isDefault: z.boolean().optional(),
});

export const createPipelineStageInputSchema = z.object({
    pipelineId: z.string().min(1),
    name: z.string().min(1),
    order: z.number().int().min(0),
    probability: z.number().min(0).max(100).optional(),
    color: z.string().optional(),
});

export const updatePipelineStageInputSchema = z.object({
    name: z.string().min(1).optional(),
    order: z.number().int().min(0).optional(),
    probability: z.number().min(0).max(100).optional(),
    color: z.string().optional(),
});

export type PipelineStage = z.infer<typeof pipelineStageSchema>;
export type Pipeline = z.infer<typeof pipelineSchema>;
export type CreatePipelineInput = z.infer<typeof createPipelineInputSchema>;
export type UpdatePipelineInput = z.infer<typeof updatePipelineInputSchema>;
export type CreatePipelineStageInput = z.infer<typeof createPipelineStageInputSchema>;
export type UpdatePipelineStageInput = z.infer<typeof updatePipelineStageInputSchema>;
