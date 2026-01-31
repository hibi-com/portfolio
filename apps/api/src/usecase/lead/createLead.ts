import type { CreateLeadInput, Lead, LeadRepository } from "~/domain/lead";

export class CreateLeadUseCase {
    constructor(private readonly leadRepository: LeadRepository) {}

    async execute(input: CreateLeadInput): Promise<Lead> {
        return this.leadRepository.create(input);
    }
}
