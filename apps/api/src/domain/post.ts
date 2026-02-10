export type { Post } from "@portfolio/api/generated/zod";

import type { Post } from "@portfolio/api/generated/zod";

export interface PostRepository {
    findAll(): Promise<Post[]>;
    findBySlug(slug: string): Promise<Post | null>;
    findById(id: string): Promise<Post | null>;
}
