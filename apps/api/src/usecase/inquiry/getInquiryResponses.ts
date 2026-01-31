import type { InquiryRepository, InquiryResponse } from "~/domain/inquiry";

export class GetInquiryResponsesUseCase {
    constructor(private readonly inquiryRepository: InquiryRepository) {}

    async execute(inquiryId: string): Promise<InquiryResponse[]> {
        return this.inquiryRepository.getResponses(inquiryId);
    }
}
