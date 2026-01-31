import type { InquiryRepository } from "~/domain/inquiry";

export class DeleteInquiryUseCase {
    constructor(private readonly inquiryRepository: InquiryRepository) {}

    async execute(id: string): Promise<void> {
        return this.inquiryRepository.delete(id);
    }
}
