import type { HttpHandler } from "msw";
import { HttpResponse, http } from "msw";
import { API_URL } from "../lib/constants.js";
import { mockPortfolios, mockPosts } from "../lib/mocks.js";
import type { ApiError } from "../lib/types.js";

function createNotFoundResponse(message: string) {
    return HttpResponse.json<ApiError>({ error: message }, { status: 404 });
}

export const restHandlers: HttpHandler[] = [
    http.get(`${API_URL}/api/posts`, () => {
        return HttpResponse.json(mockPosts);
    }),

    http.get(`${API_URL}/api/post/:slug`, ({ params }) => {
        const slug = params.slug as string;
        const post = mockPosts.find((p) => p.slug === slug);

        if (!post) {
            return createNotFoundResponse("Post not found");
        }

        return HttpResponse.json(post);
    }),

    http.get(`${API_URL}/api/portfolios`, () => {
        return HttpResponse.json(mockPortfolios);
    }),

    http.get(`${API_URL}/api/portfolio/:slug`, ({ params }) => {
        const slug = params.slug as string;
        const portfolio = mockPortfolios.find((p) => p.slug === slug);

        if (!portfolio) {
            return createNotFoundResponse("Portfolio not found");
        }

        return HttpResponse.json(portfolio);
    }),
];
