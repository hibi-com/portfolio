import {
    customerSchema as baseCustomerSchema,
    createCustomerInputSchema,
    customerStatusSchema,
    updateCustomerInputSchema,
} from "@portfolio/validation";
import { z } from "zod";

export { createCustomerInputSchema, customerStatusSchema, updateCustomerInputSchema };
export const customerSchema = baseCustomerSchema;

export const customerListItemSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    email: z.string().optional(),
    company: z.string().optional(),
    status: customerStatusSchema,
    createdAt: z.string().min(1),
});

export const customerFormDataSchema = createCustomerInputSchema;

export type CustomerSchema = z.infer<typeof customerSchema>;
export type CustomerStatusSchema = z.infer<typeof customerStatusSchema>;
export type CustomerFormDataSchema = z.infer<typeof customerFormDataSchema>;
export type CustomerListItemSchema = z.infer<typeof customerListItemSchema>;
