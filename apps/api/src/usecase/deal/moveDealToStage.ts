import type { Deal, DealRepository } from "~/domain/deal";

export class MoveDealToStageUseCase {
    constructor(private readonly dealRepository: DealRepository) {}

    async execute(id: string, stageId: string): Promise<Deal> {
        return this.dealRepository.moveToStage(id, stageId);
    }
}
