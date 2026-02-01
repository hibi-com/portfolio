import type { Post } from "~/entities/blog";

export interface BlogFeaturedProps {
    className?: string;
    post: Post;
}

export interface BlogPreviewProps {
    className?: string;
    date: string;
    heading?: string;
    slug: string;
    title: string;
    image: string;
}

export interface BlogUpcomingProps {
    className?: string;
}
