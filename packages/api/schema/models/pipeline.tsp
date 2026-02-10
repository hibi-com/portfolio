import "@typespec/http";
import "@typespec/openapi3";

model PipelineStage {
    id: string;
    pipelineId: string;
    name: string;
    order: int32;
    probability?: float64;
    color?: string;
    createdAt: string;
    updatedAt: string;
}

model Pipeline {
    id: string;
    name: string;
    description?: string;
    isDefault: boolean;
    stages: PipelineStage[];
    createdAt: string;
    updatedAt: string;
}

model CreatePipelineInput {
    name: string;
    description?: string;
    isDefault?: boolean;
}

model UpdatePipelineInput {
    name?: string;
    description?: string;
    isDefault?: boolean;
}

model CreatePipelineStageInput {
    pipelineId: string;
    name: string;
    order: int32;
    probability?: float64;
    color?: string;
}

model UpdatePipelineStageInput {
    name?: string;
    order?: int32;
    probability?: float64;
    color?: string;
}
