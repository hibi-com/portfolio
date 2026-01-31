import type { Pipeline, PipelineRepository, UpdatePipelineInput } from "~/domain/pipeline";

export class UpdatePipelineUseCase {
    constructor(private readonly pipelineRepository: PipelineRepository) {}

    async execute(id: string, input: UpdatePipelineInput): Promise<Pipeline> {
        return this.pipelineRepository.update(id, input);
    }
}
