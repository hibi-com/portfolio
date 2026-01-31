import type { Customer, CustomerRepository } from "~/domain/customer";

export class GetCustomerByIdUseCase {
    constructor(private readonly customerRepository: CustomerRepository) {}

    async execute(id: string): Promise<Customer | null> {
        return this.customerRepository.findById(id);
    }
}
