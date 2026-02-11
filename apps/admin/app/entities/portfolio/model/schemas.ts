import {
    portfolioContentSchema,
    portfolioSchema as basePortfolioSchema,
} from "@portfolio/validation";
import { z } from "zod";

// @portfolio/validation から再利用
export { portfolioContentSchema };
export const portfolioSchema = basePortfolioSchema;

// Admin固有: フォーム入力用
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

// Admin固有: リスト表示用
export const portfolioListItemSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1),
    slug: z.string().min(1),
    company: z.string().min(1),
    date: z.string().min(1),
    current: z.boolean(),
    overview: z.string().optional(),
});

// 型推論
export type PortfolioSchema = z.infer<typeof portfolioSchema>;
export type PortfolioContentSchema = z.infer<typeof portfolioContentSchema>;
export type PortfolioFormDataSchema = z.infer<typeof portfolioFormDataSchema>;
export type PortfolioListItemSchema = z.infer<typeof portfolioListItemSchema>;
