import type { R2Bucket } from "@cloudflare/workers-types";
import { AppError, ErrorCodes } from "@portfolio/log";
import type { PortfolioRepository } from "~/domain/portfolio";

export class UploadPortfolioImageUseCase {
    constructor(
        private readonly portfolioRepository: PortfolioRepository,
        private readonly r2Bucket: R2Bucket,
        private readonly r2PublicUrl: string,
    ) {}

    async execute(portfolioId: string, imageFile: File): Promise<{ url: string }> {
        const portfolio = await this.portfolioRepository.findById(portfolioId);
        if (!portfolio) {
            throw AppError.fromCode(ErrorCodes.NOT_FOUND_PORTFOLIO, "Portfolio not found", {
                metadata: { portfolioId },
            });
        }

        if (!imageFile.type.startsWith("image/")) {
            throw AppError.fromCode(ErrorCodes.VALIDATION_INVALID_TYPE, "File must be an image", {
                metadata: { contentType: imageFile.type },
            });
        }

        const maxSize = 10 * 1024 * 1024;
        if (imageFile.size > maxSize) {
            throw AppError.fromCode(ErrorCodes.VALIDATION_INVALID_TYPE, "Image size must be less than 10MB", {
                metadata: { size: imageFile.size },
            });
        }

        const timestamp = Date.now();
        const nameParts = imageFile.name.split(".");
        const extension = nameParts.length > 1 ? nameParts.pop() : "jpg";
        const key = `portfolios/${portfolioId}/${timestamp}.${extension}`;

        const arrayBuffer = await imageFile.arrayBuffer();
        await this.r2Bucket.put(key, arrayBuffer, {
            httpMetadata: {
                contentType: imageFile.type,
            },
        });

        const url = `${this.r2PublicUrl}/${key}`;

        await this.portfolioRepository.addImage(portfolioId, url);

        return { url };
    }
}
