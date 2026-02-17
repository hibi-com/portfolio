import { portfolioSchema as basePortfolioSchema, portfolioContentSchema } from "@portfolio/validation";
import { z } from "zod";

export { portfolioContentSchema } from "@portfolio/validation";
export const portfolioSchema = basePortfolioSchema;

export const portfolioFormDataSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    company: z.string().min(1),
    date: z.string().min(1),
    current: z.boolean(),
    overview: z.string().optional(),
    description: z.string().optional(),
    content: z.object({ html: z.string() }).optional(),
    thumbnailTemp: z.string().optional(),
    intro: z.string().optional(),
});

export const portfolioListItemSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1),
    slug: z.string().min(1),
    company: z.string().min(1),
    date: z.string().min(1),
    current: z.boolean(),
    overview: z.string().optional(),
});

export type PortfolioSchema = z.infer<typeof portfolioSchema>;
export type PortfolioContentSchema = z.infer<typeof portfolioContentSchema>;
export type PortfolioFormDataSchema = z.infer<typeof portfolioFormDataSchema>;
export type PortfolioListItemSchema = z.infer<typeof portfolioListItemSchema>;
