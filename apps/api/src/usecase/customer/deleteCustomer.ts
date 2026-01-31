import type { CustomerRepository } from "~/domain/customer";

export class DeleteCustomerUseCase {
    constructor(private readonly customerRepository: CustomerRepository) {}

    async execute(id: string): Promise<void> {
        return this.customerRepository.delete(id);
    }
}
