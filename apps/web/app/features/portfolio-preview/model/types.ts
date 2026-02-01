import type { Portfolio } from "~/entities/portfolio";

export interface PortfolioPreviewProps {
    current: boolean;
    data: Portfolio;
}
