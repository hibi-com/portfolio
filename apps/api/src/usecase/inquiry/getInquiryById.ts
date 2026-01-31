import type { Inquiry, InquiryRepository } from "~/domain/inquiry";

export class GetInquiryByIdUseCase {
    constructor(private readonly inquiryRepository: InquiryRepository) {}

    async execute(id: string): Promise<Inquiry | null> {
        return this.inquiryRepository.findById(id);
    }
}
