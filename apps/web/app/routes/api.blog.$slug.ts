import { slugSchema } from "@portfolio/validation";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { createApiClient } from "~/shared/lib/api";

export interface Post {
    id: string;
    title: string;
    slug: string;
    date: Date | string;
    description?: string;
    content: {
        html: string;
        raw?: unknown;
    };
    imageTemp: string;
    images?: Array<{
        url: string;
    }>;
    sticky: boolean;
    intro?: string;
    tags: string[];
    createdAt: Date | string;
    updatedAt: Date | string;
}

export type LoaderData = Post;

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
        const response = await api.posts.getPostBySlug(validatedSlug);
        const post = response.data as Post;

        if (!post) {
            throw new Response(`Post "${validatedSlug}" not found`, { status: 404 });
        }

        return Response.json(post as LoaderData);
    } catch (error) {
        if (error instanceof Response) {
            throw error;
        }
        throw new Response(`Post "${validatedSlug}" not found`, { status: 404 });
    }
};
