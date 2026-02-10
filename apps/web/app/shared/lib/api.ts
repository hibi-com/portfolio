import { getPortfolios } from "@portfolio/api/generated/portfolios/portfolios";
import { getPosts } from "@portfolio/api/generated/posts/posts";

const getBaseUrl = (apiUrl?: string) => {
    if (typeof globalThis !== "undefined" && "window" in globalThis) {
        const win = globalThis.window;
        if (win !== undefined) {
            return win.location.origin;
        }
    }
    return apiUrl ?? process.env.VITE_API_URL ?? "http://localhost:8787";
};

export const createApiClient = (apiUrl?: string) => {
    const baseURL = getBaseUrl(apiUrl);
    const postsClient = getPosts();
    const portfoliosClient = getPortfolios();

    return {
        posts: {
            listPosts: async (params?: { page?: number; perPage?: number; tag?: string }) => {
                const data = await postsClient.postsListPosts(params, { baseURL });
                return { data };
            },
            getPostBySlug: async (slug: string) => {
                const data = await postsClient.postsGetPostBySlug(slug, { baseURL });
                return { data };
            },
        },
        portfolios: {
            listPortfolios: async (params?: { page?: number; perPage?: number }) => {
                const data = await portfoliosClient.portfoliosListPortfolios(params, { baseURL });
                return { data };
            },
            getPortfolioBySlug: async (slug: string) => {
                const data = await portfoliosClient.portfoliosGetPortfolioBySlug(slug, { baseURL });
                return { data };
            },
        },
    };
};

export const api = createApiClient();
