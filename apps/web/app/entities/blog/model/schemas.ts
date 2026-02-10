import { urlSchema } from "@portfolio/validation";
import { z } from "zod";

export const postSchema = z.object({
    content: z.object({
        html: z.string(),
        raw: z.any().optional(),
    }),
    createdAt: z.string().optional(),
    date: z.string().min(1),
    description: z.string().optional(),
    id: z.string().min(1),
    images: z
        .array(
            z.object({
                url: urlSchema,
            }),
        )
        .optional(),
    imageTemp: z.string().min(1),
    intro: z.string().optional(),
    slug: z.string().min(1),
    sticky: z.boolean(),
    tags: z.array(z.string()),
    title: z.string().min(1),
    updatedAt: z.string().optional(),
});

export const enumValueSchema = z.object({
    name: z.string().min(1),
});

export const blogDataSchema = z.object({
    data: z.array(postSchema),
    featured: z.array(postSchema),
});

export type PostSchema = z.infer<typeof postSchema>;

export type EnumValueSchema = z.infer<typeof enumValueSchema>;

export type BlogDataSchema = z.infer<typeof blogDataSchema>;
