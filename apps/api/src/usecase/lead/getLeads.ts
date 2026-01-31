import type { Lead, LeadRepository } from "~/domain/lead";

export class GetLeadsUseCase {
    constructor(private readonly leadRepository: LeadRepository) {}

    async execute(): Promise<Lead[]> {
        return this.leadRepository.findAll();
    }
}
