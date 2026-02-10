import type { BlogData, Post } from "../model/types";

export const filterBlogPosts = (posts: Post[]) => {
    const diy: BlogData = { data: [], featured: [] };
    const technical: BlogData = { data: [], featured: [] };

    posts.forEach((post) => {
        const node = post.tags.includes("DIY") ? diy : technical;
        const arr = post.sticky ? node.featured : node.data;

        arr.push(post);
    });

    return {
        diy,
        technical,
    };
};
