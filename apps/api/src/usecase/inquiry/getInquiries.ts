import type { Inquiry, InquiryRepository } from "~/domain/inquiry";

export class GetInquiriesUseCase {
    constructor(private readonly inquiryRepository: InquiryRepository) {}

    async execute(): Promise<Inquiry[]> {
        return this.inquiryRepository.findAll();
    }
}
