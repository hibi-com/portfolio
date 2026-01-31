import type { CreateInquiryResponseInput, InquiryRepository, InquiryResponse } from "~/domain/inquiry";

export class AddInquiryResponseUseCase {
    constructor(private readonly inquiryRepository: InquiryRepository) {}

    async execute(input: CreateInquiryResponseInput): Promise<InquiryResponse> {
        return this.inquiryRepository.addResponse(input);
    }
}
