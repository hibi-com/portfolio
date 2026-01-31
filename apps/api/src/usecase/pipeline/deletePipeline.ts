import type { PipelineRepository } from "~/domain/pipeline";

export class DeletePipelineUseCase {
    constructor(private readonly pipelineRepository: PipelineRepository) {}

    async execute(id: string): Promise<void> {
        return this.pipelineRepository.delete(id);
    }
}
