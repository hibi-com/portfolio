import { urlSchema } from "@portfolio/validation";
import { z } from "zod";

export const portfolioSchema = z.object({
    company: z.string().min(1),
    content: z
        .object({
            html: z.string(),
        })
        .optional(),
    current: z.boolean(),
    date: z.union([z.date(), z.string()]),
    description: z.string().optional(),
    id: z.string().optional(),
    images: z
        .array(
            z.object({
                url: urlSchema,
            }),
        )
        .optional(),
    intro: z.string().optional(),
    overview: z.string().optional(),
    slug: z.string().min(1),
    thumbnailTemp: z.string().optional(),
    title: z.string().min(1),
});

export type PortfolioSchema = z.infer<typeof portfolioSchema>;
