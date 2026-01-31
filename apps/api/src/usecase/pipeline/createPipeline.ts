import type { CreatePipelineInput, Pipeline, PipelineRepository } from "~/domain/pipeline";

export class CreatePipelineUseCase {
    constructor(private readonly pipelineRepository: PipelineRepository) {}

    async execute(input: CreatePipelineInput): Promise<Pipeline> {
        return this.pipelineRepository.create(input);
    }
}
