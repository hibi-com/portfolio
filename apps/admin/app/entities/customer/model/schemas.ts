import {
    createCustomerInputSchema,
    customerSchema as baseCustomerSchema,
    customerStatusSchema,
    updateCustomerInputSchema,
} from "@portfolio/validation";
import { z } from "zod";

// @portfolio/validation から再利用
export { createCustomerInputSchema, customerStatusSchema, updateCustomerInputSchema };
export const customerSchema = baseCustomerSchema;

// Admin固有: リスト表示用
export const customerListItemSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    email: z.string().optional(),
    company: z.string().optional(),
    status: customerStatusSchema,
    createdAt: z.string().min(1),
});

// Admin固有: フォーム入力用（createCustomerInputSchemaを再利用）
export const customerFormDataSchema = createCustomerInputSchema;

// 型推論
export type CustomerSchema = z.infer<typeof customerSchema>;
export type CustomerStatusSchema = z.infer<typeof customerStatusSchema>;
export type CustomerFormDataSchema = z.infer<typeof customerFormDataSchema>;
export type CustomerListItemSchema = z.infer<typeof customerListItemSchema>;
