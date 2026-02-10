import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import type { DIContainer } from "~/di/container";
import { createTestContainer } from "../setup/container.setup";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";

describe("Inquiry Flow Integration", () => {
    let container: DIContainer;

    beforeAll(async () => {
        await setupTestDb();
        container = createTestContainer();
    });

    afterEach(async () => {
        await clearTestDb();
    });

    afterAll(async () => {
        await teardownTestDb();
    });

    describe("POST /api/support/inquiries - 問い合わせ作成", () => {
        test("正常系: 問い合わせを作成する", async () => {
            const input = {
                subject: "Technical Issue",
                content: "I'm having trouble with the application.",
                category: "TECHNICAL" as const,
                priority: "HIGH" as const,
            };

            const useCase = container.getCreateInquiryUseCase();
            const result = await useCase.execute(input);

            expect(result).toBeDefined();
            expect(result.subject).toBe("Technical Issue");
            expect(result.status).toBe("OPEN");
            expect(result.category).toBe("TECHNICAL");
            expect(result.priority).toBe("HIGH");
        });

        test("正常系: 最小限の情報で問い合わせを作成する", async () => {
            const input = {
                subject: "General Question",
                content: "How do I use this feature?",
            };

            const useCase = container.getCreateInquiryUseCase();
            const result = await useCase.execute(input);

            expect(result).toBeDefined();
            expect(result.category).toBe("GENERAL");
            expect(result.priority).toBe("MEDIUM");
        });

        test("正常系: 顧客IDを紐付けて問い合わせを作成する", async () => {
            await seedTestData({
                customers: [{ id: "cust-1", name: "Test Customer" }],
            });

            const input = {
                subject: "Customer Inquiry",
                content: "Question from customer",
                customerId: "cust-1",
            };

            const useCase = container.getCreateInquiryUseCase();
            const result = await useCase.execute(input);

            expect(result.customerId).toBe("cust-1");
        });
    });

    describe("GET /api/support/inquiries - 問い合わせ一覧取得", () => {
        test("正常系: 問い合わせ一覧を取得する", async () => {
            await seedTestData({
                inquiries: [
                    { id: "inq-1", subject: "Inquiry 1", content: "Content 1", status: "OPEN" },
                    { id: "inq-2", subject: "Inquiry 2", content: "Content 2", status: "IN_PROGRESS" },
                ],
            });

            const useCase = container.getGetInquiriesUseCase();
            const result = await useCase.execute();

            expect(result).toHaveLength(2);
        });
    });

    describe("POST /api/support/inquiries/:id/resolve - 問い合わせ解決", () => {
        test("正常系: 問い合わせを解決する", async () => {
            await seedTestData({
                inquiries: [{ id: "inq-1", subject: "To Resolve", content: "Content", status: "OPEN" }],
            });

            const useCase = container.getResolveInquiryUseCase();
            const result = await useCase.execute("inq-1");

            expect(result).toBeDefined();
            expect(result?.status).toBe("RESOLVED");
            expect(result?.resolvedAt).toBeDefined();
        });
    });

    describe("POST /api/support/inquiries/:id/close - 問い合わせクローズ", () => {
        test("正常系: 問い合わせをクローズする", async () => {
            await seedTestData({
                inquiries: [{ id: "inq-1", subject: "To Close", content: "Content", status: "RESOLVED" }],
            });

            const useCase = container.getCloseInquiryUseCase();
            const result = await useCase.execute("inq-1");

            expect(result).toBeDefined();
            expect(result?.status).toBe("CLOSED");
            expect(result?.closedAt).toBeDefined();
        });
    });

    describe("POST /api/support/inquiries/:id/responses - 返信追加", () => {
        test("正常系: 問い合わせに返信を追加する", async () => {
            await seedTestData({
                inquiries: [{ id: "inq-1", subject: "With Response", content: "Content", status: "OPEN" }],
            });

            const useCase = container.getAddInquiryResponseUseCase();
            const result = await useCase.execute({
                inquiryId: "inq-1",
                content: "Thank you for your inquiry. We will look into this.",
                isInternal: false,
            });

            expect(result).toBeDefined();
            expect(result.content).toBe("Thank you for your inquiry. We will look into this.");
            expect(result.isInternal).toBe(false);
        });

        test("正常系: 内部メモを追加する", async () => {
            await seedTestData({
                inquiries: [{ id: "inq-1", subject: "With Note", content: "Content" }],
            });

            const useCase = container.getAddInquiryResponseUseCase();
            const result = await useCase.execute({
                inquiryId: "inq-1",
                content: "Internal note: Customer is VIP",
                isInternal: true,
            });

            expect(result.isInternal).toBe(true);
        });
    });
});
