import { z } from "zod";
import { assetSchema } from "./shared";

export const postContentSchema = z.object({
    html: z.string(),
    raw: z.unknown().optional(),
});

export const postSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    slug: z.string().min(1),
    date: z.coerce.date(),
    description: z.string().optional(),
    content: z.string().min(1),
    contentRaw: z.unknown().optional(),
    imageTemp: z.string().min(1),
    tags: z.array(z.string()),
    sticky: z.boolean(),
    intro: z.string().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    images: z.array(assetSchema).optional(),
});

export const blogDataSchema = z.object({
    data: z.array(postSchema),
    featured: z.array(postSchema),
});

export type Post = z.infer<typeof postSchema>;
export type PostContent = z.infer<typeof postContentSchema>;
export type BlogData = z.infer<typeof blogDataSchema>;
