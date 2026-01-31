import type { FreeeRepository, FreeeSyncLog } from "~/domain/freee";

export class GetSyncLogsUseCase {
    constructor(private readonly freeeRepository: FreeeRepository) {}

    async execute(integrationId: string, limit?: number): Promise<FreeeSyncLog[]> {
        return this.freeeRepository.findSyncLogsByIntegrationId(integrationId, limit);
    }
}
