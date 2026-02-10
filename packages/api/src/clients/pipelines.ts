import type {
    CreatePipelineInput,
    CreatePipelineStageInput,
    Pipeline,
    PipelineStage,
    UpdatePipelineInput,
    UpdatePipelineStageInput,
} from "@generated/api.schemas";
import { getPipelines } from "@generated/pipelines/pipelines";

const pipelinesClient = getPipelines();

export const listPipelines = (): Promise<Pipeline[]> => {
    return pipelinesClient.pipelinesListPipelines();
};

export const getPipelineById = (id: string): Promise<Pipeline> => {
    return pipelinesClient.pipelinesGetPipelineById(id);
};

export const getDefaultPipeline = (): Promise<Pipeline> => {
    return pipelinesClient.pipelinesGetDefaultPipeline();
};

export const createPipeline = (input: CreatePipelineInput): Promise<Pipeline> => {
    return pipelinesClient.pipelinesCreatePipeline(input);
};

export const updatePipeline = (id: string, input: UpdatePipelineInput): Promise<Pipeline> => {
    return pipelinesClient.pipelinesUpdatePipeline(id, input);
};

export const deletePipeline = (id: string): Promise<void> => {
    return pipelinesClient.pipelinesDeletePipeline(id);
};

export const createPipelineStage = (pipelineId: string, input: CreatePipelineStageInput): Promise<PipelineStage> => {
    return pipelinesClient.pipelinesCreatePipelineStage(pipelineId, input);
};

export const updatePipelineStage = (
    pipelineId: string,
    stageId: string,
    input: UpdatePipelineStageInput,
): Promise<PipelineStage> => {
    return pipelinesClient.pipelinesUpdatePipelineStage(pipelineId, stageId, input);
};

export const deletePipelineStage = (pipelineId: string, stageId: string): Promise<void> => {
    return pipelinesClient.pipelinesDeletePipelineStage(pipelineId, stageId);
};

export const pipelines = {
    list: listPipelines,
    getById: getPipelineById,
    getDefault: getDefaultPipeline,
    create: createPipeline,
    update: updatePipeline,
    delete: deletePipeline,
    createStage: createPipelineStage,
    updateStage: updatePipelineStage,
    deleteStage: deletePipelineStage,
} as const;
