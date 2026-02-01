export interface Experience {
    company: string;
    companyUrl: string;
    contract?: boolean;
    date: string;
    dateRange?: [start: Date, end?: Date];
    description: string;
    highlights: string[];
    image?: string;
    tags: string[];
    title: string;
}

export interface Social {
    icon: string;
    title: string;
    url: string;
}
