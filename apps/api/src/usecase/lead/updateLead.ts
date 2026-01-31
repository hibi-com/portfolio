import type { Lead, LeadRepository, UpdateLeadInput } from "~/domain/lead";

export class UpdateLeadUseCase {
    constructor(private readonly leadRepository: LeadRepository) {}

    async execute(id: string, input: UpdateLeadInput): Promise<Lead> {
        return this.leadRepository.update(id, input);
    }
}
