import type { Post, PostRepository } from "~/domain/post";

export class GetPostsUseCase {
    constructor(private readonly postRepository: PostRepository) {}

    async execute(): Promise<Post[]> {
        return this.postRepository.findAll();
    }
}
