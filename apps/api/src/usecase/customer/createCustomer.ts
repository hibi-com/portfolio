import type { CreateCustomerInput, Customer, CustomerRepository } from "~/domain/customer";

export class CreateCustomerUseCase {
    constructor(private readonly customerRepository: CustomerRepository) {}

    async execute(input: CreateCustomerInput): Promise<Customer> {
        return this.customerRepository.create(input);
    }
}
