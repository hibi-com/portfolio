import type { Inquiry, InquiryRepository, UpdateInquiryInput } from "~/domain/inquiry";

export class UpdateInquiryUseCase {
    constructor(private readonly inquiryRepository: InquiryRepository) {}

    async execute(id: string, input: UpdateInquiryInput): Promise<Inquiry> {
        return this.inquiryRepository.update(id, input);
    }
}
