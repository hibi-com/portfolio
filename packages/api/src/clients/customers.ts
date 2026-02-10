import type {
    CreateCustomerInput,
    Customer,
    CustomersListCustomers200,
    CustomersListCustomersParams,
    UpdateCustomerInput,
} from "@generated/api.schemas";
import { getCustomers } from "@generated/customers/customers";

const customersClient = getCustomers();

export const listCustomers = (params?: CustomersListCustomersParams): Promise<CustomersListCustomers200> => {
    return customersClient.customersListCustomers(params);
};

export const getCustomerById = (id: string): Promise<Customer> => {
    return customersClient.customersGetCustomerById(id);
};

export const createCustomer = (input: CreateCustomerInput): Promise<Customer> => {
    return customersClient.customersCreateCustomer(input);
};

export const updateCustomer = (id: string, input: UpdateCustomerInput): Promise<Customer> => {
    return customersClient.customersUpdateCustomer(id, input);
};

export const deleteCustomer = (id: string): Promise<void> => {
    return customersClient.customersDeleteCustomer(id);
};

export const customers = {
    list: listCustomers,
    getById: getCustomerById,
    create: createCustomer,
    update: updateCustomer,
    delete: deleteCustomer,
} as const;
