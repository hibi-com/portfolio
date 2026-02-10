import { createPrismaClient } from "@portfolio/db";
import type { Post, PostRepository } from "~/domain/post";

type PostRow = Awaited<
    ReturnType<
        ReturnType<typeof createPrismaClient>["post"]["findMany"]
    >
>[number] & {
    tags: Array<{ tag: { name: string } }>;
};

function toPost(post: PostRow): Post {
    return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        date: post.date instanceof Date ? post.date.toISOString() : String(post.date),
        description: post.description ?? undefined,
        content: {
            html: post.content,
            raw: post.contentRaw ? (JSON.parse(post.contentRaw) as unknown) : undefined,
        },
        imageTemp: post.imageTemp,
        sticky: post.sticky,
        intro: post.intro ?? undefined,
        tags: post.tags.map((postTag) => postTag.tag.name),
        createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt,
        updatedAt: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : post.updatedAt,
    };
}

export class PostRepositoryImpl implements PostRepository {
    constructor(private readonly databaseUrl?: string) {}

    async findAll(): Promise<Post[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const posts = await prisma.post.findMany({
            orderBy: { date: "desc" },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
                images: true,
            },
        });

        return posts.map((row) => toPost(row as PostRow));
    }

    async findBySlug(slug: string): Promise<Post | null> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const post = await prisma.post.findUnique({
            where: { slug },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
                images: true,
            },
        });

        if (!post) return null;

        return toPost(post as PostRow);
    }

    async findById(id: string): Promise<Post | null> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
                images: true,
            },
        });

        if (!post) return null;

        return toPost(post as PostRow);
    }
}
