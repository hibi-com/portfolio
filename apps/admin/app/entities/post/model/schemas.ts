import { postSchema as basePostSchema, blogDataSchema, postContentSchema } from "@portfolio/validation";
import { z } from "zod";

export { blogDataSchema, postContentSchema } from "@portfolio/validation";
export const postSchema = basePostSchema;

export const postFormDataSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    date: z.string().min(1),
    description: z.string().optional(),
    content: z.object({
        html: z.string().min(1),
        raw: z.unknown().optional(),
    }),
    imageTemp: z.string().min(1),
    tags: z.array(z.string()),
    sticky: z.boolean(),
    intro: z.string().optional(),
});

export const postListItemSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    slug: z.string().min(1),
    date: z.string().min(1),
    description: z.string().optional(),
    tags: z.array(z.string()),
    sticky: z.boolean(),
});

export type PostSchema = z.infer<typeof postSchema>;
export type PostContentSchema = z.infer<typeof postContentSchema>;
export type BlogDataSchema = z.infer<typeof blogDataSchema>;
export type PostFormDataSchema = z.infer<typeof postFormDataSchema>;
export type PostListItemSchema = z.infer<typeof postListItemSchema>;
