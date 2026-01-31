import type { FreeeRepository } from "~/domain/freee";

export class DisconnectFreeeUseCase {
    constructor(private readonly freeeRepository: FreeeRepository) {}

    async execute(integrationId: string): Promise<void> {
        await this.freeeRepository.deactivateIntegration(integrationId);
    }
}
