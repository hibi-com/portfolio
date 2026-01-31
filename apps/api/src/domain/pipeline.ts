export interface Pipeline {
    id: string;
    name: string;
    description?: string;
    isDefault: boolean;
    stages: PipelineStage[];
    createdAt: Date;
    updatedAt: Date;
}

export interface PipelineStage {
    id: string;
    pipelineId: string;
    name: string;
    order: number;
    probability?: number;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreatePipelineInput {
    name: string;
    description?: string;
    isDefault?: boolean;
}

export interface UpdatePipelineInput {
    name?: string;
    description?: string;
    isDefault?: boolean;
}

export interface CreatePipelineStageInput {
    pipelineId: string;
    name: string;
    order: number;
    probability?: number;
    color?: string;
}

export interface UpdatePipelineStageInput {
    name?: string;
    order?: number;
    probability?: number;
    color?: string;
}

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
