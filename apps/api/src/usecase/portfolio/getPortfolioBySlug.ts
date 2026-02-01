import type { Portfolio, PortfolioRepository } from "~/domain/portfolio";

export class GetPortfolioBySlugUseCase {
    constructor(private readonly portfolioRepository: PortfolioRepository) {}

    async execute(slug: string): Promise<Portfolio | null> {
        return this.portfolioRepository.findBySlug(slug);
    }
}
