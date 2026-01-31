import type { FreeeSyncLog, FreeeSyncService } from "~/domain/freee";

export class SyncPartnersToFreeeUseCase {
    constructor(private readonly syncService: FreeeSyncService) {}

    async execute(integrationId: string): Promise<FreeeSyncLog> {
        return this.syncService.syncPartnersToFreee(integrationId);
    }
}
