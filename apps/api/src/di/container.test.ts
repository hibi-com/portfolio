import { DIContainer } from "./container";

describe("DIContainer", () => {
    const testDatabaseUrl = "mysql://user:password@localhost:3306/portfolio";

    test("should create container instance", () => {
        const container = new DIContainer(testDatabaseUrl);

        expect(container).toBeDefined();
    });

    test("should return post repository", () => {
        const container = new DIContainer(testDatabaseUrl);

        const repository = container.getPostRepository();
        expect(repository).toBeDefined();
    });

    test("should return portfolio repository", () => {
        const container = new DIContainer(testDatabaseUrl);

        const repository = container.getPortfolioRepository();
        expect(repository).toBeDefined();
    });

    test("should return use cases", () => {
        const container = new DIContainer(testDatabaseUrl);

        expect(container.getGetPostsUseCase()).toBeDefined();
        expect(container.getGetPostBySlugUseCase()).toBeDefined();
        expect(container.getGetPortfoliosUseCase()).toBeDefined();
        expect(container.getGetPortfolioBySlugUseCase()).toBeDefined();
    });
});
