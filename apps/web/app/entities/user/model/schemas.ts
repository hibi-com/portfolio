import { urlSchema } from "@portfolio/validation";
import { z } from "zod";

export const experienceSchema = z.object({
    company: z.string().min(1),
    companyUrl: urlSchema,
    contract: z.boolean().optional(),
    date: z.string().min(1),
    dateRange: z.tuple([z.date(), z.date().optional()]).optional(),
    description: z.string().min(1),
    highlights: z.array(z.string()),
    image: urlSchema.optional(),
    tags: z.array(z.string()),
    title: z.string().min(1),
});

export const socialSchema = z.object({
    icon: z.string().min(1),
    title: z.string().min(1),
    url: urlSchema,
});

export type ExperienceSchema = z.infer<typeof experienceSchema>;

export type SocialSchema = z.infer<typeof socialSchema>;
