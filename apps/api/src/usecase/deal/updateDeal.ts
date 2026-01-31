import type { Deal, DealRepository, UpdateDealInput } from "~/domain/deal";

export class UpdateDealUseCase {
    constructor(private readonly dealRepository: DealRepository) {}

    async execute(id: string, input: UpdateDealInput): Promise<Deal> {
        return this.dealRepository.update(id, input);
    }
}
