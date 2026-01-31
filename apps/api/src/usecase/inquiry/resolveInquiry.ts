import type { Inquiry, InquiryRepository } from "~/domain/inquiry";

export class ResolveInquiryUseCase {
    constructor(private readonly inquiryRepository: InquiryRepository) {}

    async execute(id: string): Promise<Inquiry> {
        return this.inquiryRepository.resolve(id);
    }
}
