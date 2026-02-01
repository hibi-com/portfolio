export interface Portfolio {
    company: string;
    content?: {
        html: string;
    };
    current: boolean;
    date: Date | string;
    description?: string;
    id?: string;
    images?: Array<{
        url: string;
    }>;
    intro?: string;
    overview?: string;
    slug: string;
    thumbnailTemp?: string;
    title: string;
}
