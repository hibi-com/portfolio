import { createPrismaClient } from "@portfolio/db";
import type { Portfolio, PortfolioRepository } from "~/domain/portfolio";

type PortfolioRow = Awaited<
    ReturnType<
        ReturnType<typeof createPrismaClient>["portfolio"]["findMany"]
    >
>[number];

function toPortfolio(row: PortfolioRow): Portfolio {
    return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        company: row.company,
        date: row.date instanceof Date ? row.date.toISOString() : String(row.date),
        current: row.current,
        overview: row.overview ?? undefined,
        description: row.description ?? undefined,
        content:
            row.content != null && row.content !== ""
                ? { html: row.content }
                : undefined,
        thumbnailTemp: row.thumbnailTemp ?? undefined,
        intro: row.intro ?? undefined,
    };
}

export class PortfolioRepositoryImpl implements PortfolioRepository {
    constructor(private readonly databaseUrl?: string) {}

    async findAll(): Promise<Portfolio[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const portfolios = await prisma.portfolio.findMany({
            orderBy: { date: "desc" },
            include: {
                images: true,
            },
        });

        return portfolios.map((row) => toPortfolio(row as PortfolioRow));
    }

    async findBySlug(slug: string): Promise<Portfolio | null> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const portfolio = await prisma.portfolio.findUnique({
            where: { slug },
            include: {
                images: true,
            },
        });

        if (!portfolio) return null;

        return toPortfolio(portfolio as PortfolioRow);
    }

    async findById(id: string): Promise<Portfolio | null> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const portfolio = await prisma.portfolio.findUnique({
            where: { id },
            include: {
                images: true,
            },
        });

        if (!portfolio) return null;

        return toPortfolio(portfolio as PortfolioRow);
    }

    async addImage(portfolioId: string, imageUrl: string): Promise<void> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        await prisma.portfolioImage.create({
            data: {
                portfolioId,
                url: imageUrl,
            },
        });
    }
}
