import type {
    CreatePipelineInput,
    CreatePipelineStageInput,
    Pipeline,
    PipelineStage,
    UpdatePipelineInput,
    UpdatePipelineStageInput,
} from "@generated/api.schemas";
import { getPipelines } from "@generated/pipelines/pipelines";

const getClient = () => getPipelines();

export const listPipelines = (): Promise<Pipeline[]> => {
    return getClient().pipelinesListPipelines();
};

export const getPipelineById = (id: string): Promise<Pipeline> => {
    return getClient().pipelinesGetPipelineById(id);
};

export const getDefaultPipeline = (): Promise<Pipeline> => {
    return getClient().pipelinesGetDefaultPipeline();
};

export const createPipeline = (input: CreatePipelineInput): Promise<Pipeline> => {
    return getClient().pipelinesCreatePipeline(input);
};

export const updatePipeline = (id: string, input: UpdatePipelineInput): Promise<Pipeline> => {
    return getClient().pipelinesUpdatePipeline(id, input);
};

export const deletePipeline = (id: string): Promise<void> => {
    return getClient().pipelinesDeletePipeline(id);
};

export const createPipelineStage = (pipelineId: string, input: CreatePipelineStageInput): Promise<PipelineStage> => {
    return getClient().pipelinesCreatePipelineStage(pipelineId, input);
};

export const updatePipelineStage = (
    pipelineId: string,
    stageId: string,
    input: UpdatePipelineStageInput,
): Promise<PipelineStage> => {
    return getClient().pipelinesUpdatePipelineStage(pipelineId, stageId, input);
};

export const deletePipelineStage = (pipelineId: string, stageId: string): Promise<void> => {
    return getClient().pipelinesDeletePipelineStage(pipelineId, stageId);
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
