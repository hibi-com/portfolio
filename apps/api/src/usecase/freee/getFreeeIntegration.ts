import type { FreeeIntegration, FreeeRepository } from "~/domain/freee";

export class GetFreeeIntegrationUseCase {
    constructor(private readonly freeeRepository: FreeeRepository) {}

    async execute(userId: string): Promise<FreeeIntegration | null> {
        return this.freeeRepository.findIntegrationByUserId(userId);
    }
}
