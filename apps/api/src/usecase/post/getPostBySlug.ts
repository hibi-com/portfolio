import type { Post, PostRepository } from "~/domain/post";

export class GetPostBySlugUseCase {
    constructor(private readonly postRepository: PostRepository) {}

    async execute(slug: string): Promise<Post | null> {
        return this.postRepository.findBySlug(slug);
    }
}
