import { beforeEach, describe, expect, test, vi } from "vitest";
import { inquiriesRouter } from "./inquiries";

vi.mock("~/di/container", () => ({
    DIContainer: vi.fn().mockImplementation(() => ({
        getGetInquiriesUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue([
                {
                    id: "123e4567-e89b-12d3-a456-426614174000",
                    subject: "Test Inquiry",
                    content: "Test content",
                    status: "OPEN",
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            ]),
        })),
        getGetInquiryByIdUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                subject: "Test Inquiry",
                content: "Test content",
                status: "OPEN",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getCreateInquiryUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                subject: "New Inquiry",
                content: "New content",
                status: "OPEN",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getUpdateInquiryUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                subject: "Updated Inquiry",
                content: "Updated content",
                status: "IN_PROGRESS",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getDeleteInquiryUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue(undefined),
        })),
        getResolveInquiryUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                subject: "Test Inquiry",
                content: "Test content",
                status: "RESOLVED",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getCloseInquiryUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                subject: "Test Inquiry",
                content: "Test content",
                status: "CLOSED",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getGetInquiryResponsesUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue([
                {
                    id: "response-123",
                    inquiryId: "123e4567-e89b-12d3-a456-426614174000",
                    content: "Response content",
                    isInternal: false,
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            ]),
        })),
        getAddInquiryResponseUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "response-123",
                inquiryId: "123e4567-e89b-12d3-a456-426614174000",
                content: "New response",
                isInternal: false,
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
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

vi.mock("~/lib/validation", () => ({
    isValidUuid: vi.fn((str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)),
}));

describe("inquiriesRouter", () => {
    const mockEnv = {
        DATABASE_URL: "test-db-url",
        CACHE_URL: "test-cache-url",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /inquiries", () => {
        describe("正常系", () => {
            test("問い合わせ一覧を200で返す", async () => {
                const req = new Request("http://localhost/inquiries", {
                    method: "GET",
                });

                const res = await inquiriesRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(Array.isArray(json)).toBe(true);
            });
        });
    });

    describe("GET /inquiries/:id", () => {
        describe("正常系", () => {
            test("指定されたIDの問い合わせを200で返す", async () => {
                const req = new Request("http://localhost/inquiries/123e4567-e89b-12d3-a456-426614174000", {
                    method: "GET",
                });

                const res = await inquiriesRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("id");
            });
        });

        describe("異常系", () => {
            test("無効なUUID形式の場合は400を返す", async () => {
                const req = new Request("http://localhost/inquiries/invalid-uuid", {
                    method: "GET",
                });

                const res = await inquiriesRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(400);
            });
        });
    });

    describe("POST /inquiries", () => {
        describe("正常系", () => {
            test("新しい問い合わせを201で作成する", async () => {
                const req = new Request("http://localhost/inquiries", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        subject: "New Inquiry",
                        content: "New content",
                    }),
                });

                const res = await inquiriesRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(201);
            });
        });
    });

    describe("POST /inquiries/:id/resolve", () => {
        describe("正常系", () => {
            test("問い合わせを解決済みにして200を返す", async () => {
                const req = new Request("http://localhost/inquiries/123e4567-e89b-12d3-a456-426614174000/resolve", {
                    method: "POST",
                });

                const res = await inquiriesRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("status", "RESOLVED");
            });
        });
    });

    describe("POST /inquiries/:id/close", () => {
        describe("正常系", () => {
            test("問い合わせを終了して200を返す", async () => {
                const req = new Request("http://localhost/inquiries/123e4567-e89b-12d3-a456-426614174000/close", {
                    method: "POST",
                });

                const res = await inquiriesRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("status", "CLOSED");
            });
        });
    });

    describe("GET /inquiries/:id/responses", () => {
        describe("正常系", () => {
            test("問い合わせへの返信一覧を200で返す", async () => {
                const req = new Request("http://localhost/inquiries/123e4567-e89b-12d3-a456-426614174000/responses", {
                    method: "GET",
                });

                const res = await inquiriesRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(Array.isArray(json)).toBe(true);
            });
        });
    });

    describe("POST /inquiries/:id/responses", () => {
        describe("正常系", () => {
            test("問い合わせに返信を201で追加する", async () => {
                const req = new Request("http://localhost/inquiries/123e4567-e89b-12d3-a456-426614174000/responses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content: "New response",
                        isInternal: false,
                    }),
                });

                const res = await inquiriesRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(201);
            });
        });
    });

    describe("DELETE /inquiries/:id", () => {
        describe("正常系", () => {
            test("問い合わせを204で削除する", async () => {
                const req = new Request("http://localhost/inquiries/123e4567-e89b-12d3-a456-426614174000", {
                    method: "DELETE",
                });

                const res = await inquiriesRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(204);
            });
        });
    });
});
