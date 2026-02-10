import type { Post, PostsListPosts200, PostsListPostsParams } from "@generated/api.schemas";
import { getPosts } from "@generated/posts/posts";

const postsClient = getPosts();

export const listPosts = (params?: PostsListPostsParams): Promise<PostsListPosts200> => {
    return postsClient.postsListPosts(params);
};

export const getPostBySlug = (slug: string): Promise<Post> => {
    return postsClient.postsGetPostBySlug(slug);
};

export const posts = {
    list: listPosts,
    getBySlug: getPostBySlug,
} as const;
