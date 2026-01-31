import type { Pipeline, PipelineRepository } from "~/domain/pipeline";

export class GetPipelineByIdUseCase {
    constructor(private readonly pipelineRepository: PipelineRepository) {}

    async execute(id: string): Promise<Pipeline | null> {
        return this.pipelineRepository.findById(id);
    }
}
