import type { Lead, LeadRepository } from "~/domain/lead";

export class GetLeadByIdUseCase {
    constructor(private readonly leadRepository: LeadRepository) {}

    async execute(id: string): Promise<Lead | null> {
        return this.leadRepository.findById(id);
    }
}
