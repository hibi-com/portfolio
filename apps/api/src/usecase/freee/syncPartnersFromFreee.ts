import type { FreeeSyncLog, FreeeSyncService } from "~/domain/freee";

export class SyncPartnersFromFreeeUseCase {
    constructor(private readonly syncService: FreeeSyncService) {}

    async execute(integrationId: string): Promise<FreeeSyncLog> {
        return this.syncService.syncPartnersFromFreee(integrationId);
    }
}
