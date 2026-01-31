import type { Customer, CustomerRepository, UpdateCustomerInput } from "~/domain/customer";

export class UpdateCustomerUseCase {
    constructor(private readonly customerRepository: CustomerRepository) {}

    async execute(id: string, input: UpdateCustomerInput): Promise<Customer> {
        return this.customerRepository.update(id, input);
    }
}
