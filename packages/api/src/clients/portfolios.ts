import type { Portfolio, PortfoliosListPortfolios200, PortfoliosListPortfoliosParams } from "@generated/api.schemas";
import { getPortfolios } from "@generated/portfolios/portfolios";

const getClient = () => getPortfolios();

export const listPortfolios = (params?: PortfoliosListPortfoliosParams): Promise<PortfoliosListPortfolios200> => {
    return getClient().portfoliosListPortfolios(params);
};

export const getPortfolioBySlug = (slug: string): Promise<Portfolio> => {
    return getClient().portfoliosGetPortfolioBySlug(slug);
};

export const portfolios = {
    list: listPortfolios,
    getBySlug: getPortfolioBySlug,
} as const;
