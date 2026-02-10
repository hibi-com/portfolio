import { slugSchema } from "@portfolio/validation";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { createApiClient } from "~/shared/lib/api";

export interface Portfolio {
    id: string;
    title: string;
    slug: string;
    company: string;
    date: Date | string;
    current: boolean;
    overview?: string;
    description?: string;
    content?: {
        html: string;
    };
    images?: Array<{
        url: string;
    }>;
    thumbnailTemp?: string;
    intro?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export type LoaderData = Portfolio;

export const loader: LoaderFunction = async (args) => {
    const { slug } = args.params;

    const slugResult = slugSchema.safeParse(slug);
    if (!slugResult.success) {
        throw new Response("Invalid slug parameter", { status: 400 });
    }

    const validatedSlug = slugResult.data;
    const apiUrl =
        args.context.cloudflare && typeof args.context.cloudflare === "object" && "env" in args.context.cloudflare
            ? (args.context.cloudflare.env as { VITE_API_URL?: string })?.VITE_API_URL
            : undefined;
    const api = createApiClient(apiUrl);

    try {
        const response = await api.portfolios.getPortfolioBySlug(validatedSlug);
        const portfolio = response.data as Portfolio;

        if (!portfolio) {
            throw new Response(`Portfolio "${validatedSlug}" not found`, { status: 404 });
        }

        return json(portfolio as LoaderData);
    } catch (error) {
        if (error instanceof Response) {
            throw error;
        }
        throw new Response(`Portfolio "${validatedSlug}" not found`, { status: 404 });
    }
};
