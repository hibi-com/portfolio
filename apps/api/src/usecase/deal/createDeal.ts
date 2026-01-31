import type { CreateDealInput, Deal, DealRepository } from "~/domain/deal";

export class CreateDealUseCase {
    constructor(private readonly dealRepository: DealRepository) {}

    async execute(input: CreateDealInput): Promise<Deal> {
        return this.dealRepository.create(input);
    }
}
