import type { DealRepository } from "~/domain/deal";

export class DeleteDealUseCase {
    constructor(private readonly dealRepository: DealRepository) {}

    async execute(id: string): Promise<void> {
        return this.dealRepository.delete(id);
    }
}
