export type { Portfolio } from "@portfolio/api/generated/zod";

import type { Portfolio } from "@portfolio/api/generated/zod";

export interface PortfolioRepository {
    findAll(): Promise<Portfolio[]>;
    findBySlug(slug: string): Promise<Portfolio | null>;
    findById(id: string): Promise<Portfolio | null>;
    addImage(portfolioId: string, imageUrl: string): Promise<void>;
}
