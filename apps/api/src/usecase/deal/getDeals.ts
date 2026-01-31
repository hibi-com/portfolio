import type { Deal, DealRepository } from "~/domain/deal";

export class GetDealsUseCase {
    constructor(private readonly dealRepository: DealRepository) {}

    async execute(): Promise<Deal[]> {
        return this.dealRepository.findAll();
    }
}
