import type { Portfolio, PortfoliosListPortfolios200, PortfoliosListPortfoliosParams } from "@generated/api.schemas";
import { getPortfolios } from "@generated/portfolios/portfolios";

const portfoliosClient = getPortfolios();

export const listPortfolios = (params?: PortfoliosListPortfoliosParams): Promise<PortfoliosListPortfolios200> => {
    return portfoliosClient.portfoliosListPortfolios(params);
};

export const getPortfolioBySlug = (slug: string): Promise<Portfolio> => {
    return portfoliosClient.portfoliosGetPortfolioBySlug(slug);
};

export const portfolios = {
    list: listPortfolios,
    getBySlug: getPortfolioBySlug,
} as const;
