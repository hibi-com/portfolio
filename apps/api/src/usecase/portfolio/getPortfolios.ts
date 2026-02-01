import type { Portfolio, PortfolioRepository } from "~/domain/portfolio";

export class GetPortfoliosUseCase {
    constructor(private readonly portfolioRepository: PortfolioRepository) {}

    async execute(): Promise<Portfolio[]> {
        return this.portfolioRepository.findAll();
    }
}
