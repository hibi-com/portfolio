import type { LeadRepository } from "~/domain/lead";

export class DeleteLeadUseCase {
    constructor(private readonly leadRepository: LeadRepository) {}

    async execute(id: string): Promise<void> {
        return this.leadRepository.delete(id);
    }
}
