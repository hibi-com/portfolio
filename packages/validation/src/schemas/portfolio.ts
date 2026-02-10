import { z } from "zod";
import { assetSchema } from "./shared";

export const portfolioContentSchema = z.object({
    html: z.string(),
});

export const portfolioSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    slug: z.string().min(1),
    company: z.string().min(1),
    date: z.coerce.date(),
    current: z.boolean(),
    overview: z.string().optional(),
    description: z.string().optional(),
    content: z.string().optional(),
    thumbnailTemp: z.string().optional(),
    images: z.array(assetSchema).optional(),
    intro: z.string().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type Portfolio = z.infer<typeof portfolioSchema>;
export type PortfolioContent = z.infer<typeof portfolioContentSchema>;
