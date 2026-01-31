import type { Customer, CustomerRepository } from "~/domain/customer";

export class GetCustomersUseCase {
    constructor(private readonly customerRepository: CustomerRepository) {}

    async execute(): Promise<Customer[]> {
        return this.customerRepository.findAll();
    }
}
