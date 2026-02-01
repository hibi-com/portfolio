export interface Post {
    content: {
        html: string;
        raw?: unknown;
    };
    createdAt?: string;
    date: string;
    description?: string;
    id: string;
    images?: Array<{
        url: string;
    }>;
    imageTemp: string;
    intro?: string;
    slug: string;
    sticky: boolean;
    tags: string[];
    title: string;
    updatedAt?: string;
}

export interface EnumValue {
    name: string;
}

export interface BlogData {
    data: Post[];
    featured: Post[];
}
