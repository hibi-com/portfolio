import { customersRouter } from "./customers";

vi.mock("~/di/container", () => ({
    DIContainer: vi.fn().mockImplementation(() => ({
        getGetCustomersUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue([
                {
                    id: "123e4567-e89b-12d3-a456-426614174000",
                    name: "Test Customer",
                    email: "test@example.com",
                    status: "ACTIVE",
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            ]),
        })),
        getGetCustomerByIdUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                name: "Test Customer",
                email: "test@example.com",
                status: "ACTIVE",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getCreateCustomerUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                name: "New Customer",
                email: "new@example.com",
                status: "ACTIVE",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getUpdateCustomerUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                name: "Updated Customer",
                email: "updated@example.com",
                status: "ACTIVE",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getDeleteCustomerUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue(undefined),
        })),
    })),
}));

vi.mock("~/lib/logger", () => ({
    getLogger: vi.fn(() => ({
        logError: vi.fn(),
    })),
    getMetrics: vi.fn(() => ({
        httpRequestDuration: {
            observe: vi.fn(),
        },
        httpRequestTotal: {
            inc: vi.fn(),
        },
    })),
}));

describe("customersRouter", () => {
    const mockEnv = {
        DATABASE_URL: "test-db-url",
        CACHE_URL: "test-cache-url",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /customers", () => {
        describe("正常系", () => {
            test("顧客一覧を200で返す", async () => {
                const req = new Request("http://localhost/customers", {
                    method: "GET",
                });

                const res = await customersRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(Array.isArray(json)).toBe(true);
                const list = json as Array<Record<string, unknown>>;
                expect(list).toHaveLength(1);
                expect(list[0]).toHaveProperty("id");
                expect(list[0]).toHaveProperty("name");
            });
        });
    });

    describe("GET /customers/:id", () => {
        describe("正常系", () => {
            test("指定されたIDの顧客を200で返す", async () => {
                const req = new Request("http://localhost/customers/123e4567-e89b-12d3-a456-426614174000", {
                    method: "GET",
                });

                const res = await customersRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("id", "123e4567-e89b-12d3-a456-426614174000");
            });
        });

        describe("異常系", () => {
            test("顧客が見つからない場合は404を返す", async () => {
                const { DIContainer } = await import("~/di/container");
                vi.mocked(DIContainer).mockImplementationOnce(
                    () =>
                        ({
                            getGetCustomerByIdUseCase: vi.fn(() => ({
                                execute: vi.fn().mockResolvedValue(null),
                            })),
                        }) as never,
                );

                const req = new Request("http://localhost/customers/123e4567-e89b-12d3-a456-426614174000", {
                    method: "GET",
                });

                const res = await customersRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(404);
                const json = await res.json();
                expect(json).toHaveProperty("error");
            });
        });
    });

    describe("POST /customers", () => {
        describe("正常系", () => {
            test("新しい顧客を201で作成する", async () => {
                const req = new Request("http://localhost/customers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "New Customer",
                        email: "new@example.com",
                    }),
                });

                const res = await customersRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(201);
                const json = await res.json();
                expect(json).toHaveProperty("id");
                expect(json).toHaveProperty("name", "New Customer");
            });
        });
    });

    describe("PUT /customers/:id", () => {
        describe("正常系", () => {
            test("顧客情報を200で更新する", async () => {
                const req = new Request("http://localhost/customers/123e4567-e89b-12d3-a456-426614174000", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "Updated Customer",
                    }),
                });

                const res = await customersRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("name", "Updated Customer");
            });
        });
    });

    describe("DELETE /customers/:id", () => {
        describe("正常系", () => {
            test("顧客を204で削除する", async () => {
                const req = new Request("http://localhost/customers/123e4567-e89b-12d3-a456-426614174000", {
                    method: "DELETE",
                });

                const res = await customersRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(204);
            });
        });
    });
});
