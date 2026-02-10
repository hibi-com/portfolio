export type {
    CreatePipelineInput,
    CreatePipelineStageInput,
    Pipeline,
    PipelineStage,
    UpdatePipelineInput,
    UpdatePipelineStageInput,
} from "@portfolio/api/generated/zod";

import type {
    CreatePipelineInput,
    CreatePipelineStageInput,
    Pipeline,
    PipelineStage,
    UpdatePipelineInput,
    UpdatePipelineStageInput,
} from "@portfolio/api/generated/zod";

export interface PipelineRepository {
    findAll(): Promise<Pipeline[]>;
    findById(id: string): Promise<Pipeline | null>;
    findDefault(): Promise<Pipeline | null>;
    create(input: CreatePipelineInput): Promise<Pipeline>;
    update(id: string, input: UpdatePipelineInput): Promise<Pipeline>;
    delete(id: string): Promise<void>;
    createStage(input: CreatePipelineStageInput): Promise<PipelineStage>;
    updateStage(id: string, input: UpdatePipelineStageInput): Promise<PipelineStage>;
    deleteStage(id: string): Promise<void>;
    findStageById(id: string): Promise<PipelineStage | null>;
}
