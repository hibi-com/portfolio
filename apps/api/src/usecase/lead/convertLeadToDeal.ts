import type { Lead, LeadRepository } from "~/domain/lead";

export class ConvertLeadToDealUseCase {
    constructor(private readonly leadRepository: LeadRepository) {}

    async execute(id: string): Promise<Lead> {
        return this.leadRepository.convertToDeal(id);
    }
}
