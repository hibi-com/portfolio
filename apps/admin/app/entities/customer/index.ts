// 型（interface）
export type { Customer, CustomerFormData, CustomerListItem, CustomerStatus } from "./model/types";

// スキーマ
export {
    createCustomerInputSchema,
    customerFormDataSchema,
    customerListItemSchema,
    customerSchema,
    customerStatusSchema,
    updateCustomerInputSchema,
} from "./model/schemas";

// スキーマ型
export type {
    CustomerFormDataSchema,
    CustomerListItemSchema,
    CustomerSchema,
    CustomerStatusSchema,
} from "./model/schemas";
