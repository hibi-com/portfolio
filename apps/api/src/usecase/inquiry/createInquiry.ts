import type { CreateInquiryInput, Inquiry, InquiryRepository } from "~/domain/inquiry";

export class CreateInquiryUseCase {
    constructor(private readonly inquiryRepository: InquiryRepository) {}

    async execute(input: CreateInquiryInput): Promise<Inquiry> {
        return this.inquiryRepository.create(input);
    }
}
