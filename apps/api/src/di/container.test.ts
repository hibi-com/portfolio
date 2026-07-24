import { DIContainer } from "./container";

const TEST_DATABASE_URL = "file:./test-di-container.db";

describe("DIContainer", () => {
    test("should create container instance", () => {
        const container = new DIContainer(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            TEST_DATABASE_URL,
        );

        expect(container).toBeDefined();
    });

    test("should return post repository", () => {
        const container = new DIContainer(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            TEST_DATABASE_URL,
        );

        const repository = container.getPostRepository();
        expect(repository).toBeDefined();
    });

    test("should return portfolio repository", () => {
        const container = new DIContainer(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            TEST_DATABASE_URL,
        );

        const repository = container.getPortfolioRepository();
        expect(repository).toBeDefined();
    });

    test("should return use cases", () => {
        const container = new DIContainer(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            TEST_DATABASE_URL,
        );

        expect(container.getGetPostsUseCase()).toBeDefined();
        expect(container.getGetPostBySlugUseCase()).toBeDefined();
        expect(container.getGetPortfoliosUseCase()).toBeDefined();
        expect(container.getGetPortfolioBySlugUseCase()).toBeDefined();
    });
});
