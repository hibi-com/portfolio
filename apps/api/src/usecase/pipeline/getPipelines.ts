import type { Pipeline, PipelineRepository } from "~/domain/pipeline";

export class GetPipelinesUseCase {
    constructor(private readonly pipelineRepository: PipelineRepository) {}

    async execute(): Promise<Pipeline[]> {
        return this.pipelineRepository.findAll();
    }
}
