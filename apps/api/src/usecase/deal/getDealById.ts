import type { Deal, DealRepository } from "~/domain/deal";

export class GetDealByIdUseCase {
    constructor(private readonly dealRepository: DealRepository) {}

    async execute(id: string): Promise<Deal | null> {
        return this.dealRepository.findById(id);
    }
}
