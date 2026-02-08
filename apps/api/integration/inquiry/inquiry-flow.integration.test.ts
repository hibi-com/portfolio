/**
 * @sequence docs/sequence/api/inquiry/inquiry-create.md
 * @description 問い合わせフローの統合テスト
 *
 * シーケンス図に基づき、以下のフローを検証:
 * Client → API → DIContainer → UseCase → Repository → DB
 */

import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";
import { createTestContainer } from "../setup/container.setup";
import type { DIContainer } from "../../../src/di/container";

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
            // Given: 入力データ
            const input = {
                subject: "Technical Issue",
                content: "I'm having trouble with the application.",
                category: "TECHNICAL" as const,
                priority: "HIGH" as const,
            };

            // When: CreateInquiryUseCase を実行
            const useCase = container.getCreateInquiryUseCase();
            const result = await useCase.execute(input);

            // Then: 問い合わせが作成される
            expect(result).toBeDefined();
            expect(result.subject).toBe("Technical Issue");
            expect(result.status).toBe("OPEN");
            expect(result.category).toBe("TECHNICAL");
            expect(result.priority).toBe("HIGH");
        });

        test("正常系: 最小限の情報で問い合わせを作成する", async () => {
            // Given: 必須項目のみ
            const input = {
                subject: "General Question",
                content: "How do I use this feature?",
            };

            // When: CreateInquiryUseCase を実行
            const useCase = container.getCreateInquiryUseCase();
            const result = await useCase.execute(input);

            // Then: デフォルト値で作成される
            expect(result).toBeDefined();
            expect(result.category).toBe("GENERAL");
            expect(result.priority).toBe("MEDIUM");
        });

        test("正常系: 顧客IDを紐付けて問い合わせを作成する", async () => {
            // Given: 顧客が存在する
            await seedTestData({
                customers: [{ id: "cust-1", name: "Test Customer" }],
            });

            const input = {
                subject: "Customer Inquiry",
                content: "Question from customer",
                customerId: "cust-1",
            };

            // When: CreateInquiryUseCase を実行
            const useCase = container.getCreateInquiryUseCase();
            const result = await useCase.execute(input);

            // Then: 顧客IDが紐付けられる
            expect(result.customerId).toBe("cust-1");
        });
    });

    describe("GET /api/support/inquiries - 問い合わせ一覧取得", () => {
        test("正常系: 問い合わせ一覧を取得する", async () => {
            // Given: 問い合わせが存在する
            await seedTestData({
                inquiries: [
                    { id: "inq-1", subject: "Inquiry 1", content: "Content 1", status: "OPEN" },
                    { id: "inq-2", subject: "Inquiry 2", content: "Content 2", status: "IN_PROGRESS" },
                ],
            });

            // When: GetInquiriesUseCase を実行
            const useCase = container.getGetInquiriesUseCase();
            const result = await useCase.execute();

            // Then: 問い合わせ一覧がレスポンスされる
            expect(result).toHaveLength(2);
        });
    });

    describe("POST /api/support/inquiries/:id/resolve - 問い合わせ解決", () => {
        test("正常系: 問い合わせを解決する", async () => {
            // Given: オープンな問い合わせが存在する
            await seedTestData({
                inquiries: [{ id: "inq-1", subject: "To Resolve", content: "Content", status: "OPEN" }],
            });

            // When: ResolveInquiryUseCase を実行
            const useCase = container.getResolveInquiryUseCase();
            const result = await useCase.execute("inq-1");

            // Then: ステータスがRESOLVEDになる
            expect(result).toBeDefined();
            expect(result?.status).toBe("RESOLVED");
            expect(result?.resolvedAt).toBeDefined();
        });
    });

    describe("POST /api/support/inquiries/:id/close - 問い合わせクローズ", () => {
        test("正常系: 問い合わせをクローズする", async () => {
            // Given: 解決済みの問い合わせが存在する
            await seedTestData({
                inquiries: [{ id: "inq-1", subject: "To Close", content: "Content", status: "RESOLVED" }],
            });

            // When: CloseInquiryUseCase を実行
            const useCase = container.getCloseInquiryUseCase();
            const result = await useCase.execute("inq-1");

            // Then: ステータスがCLOSEDになる
            expect(result).toBeDefined();
            expect(result?.status).toBe("CLOSED");
            expect(result?.closedAt).toBeDefined();
        });
    });

    describe("POST /api/support/inquiries/:id/responses - 返信追加", () => {
        test("正常系: 問い合わせに返信を追加する", async () => {
            // Given: 問い合わせが存在する
            await seedTestData({
                inquiries: [{ id: "inq-1", subject: "With Response", content: "Content", status: "OPEN" }],
            });

            // When: AddInquiryResponseUseCase を実行
            const useCase = container.getAddInquiryResponseUseCase();
            const result = await useCase.execute("inq-1", {
                content: "Thank you for your inquiry. We will look into this.",
                isInternal: false,
            });

            // Then: 返信が追加される
            expect(result).toBeDefined();
            expect(result.content).toBe("Thank you for your inquiry. We will look into this.");
            expect(result.isInternal).toBe(false);
        });

        test("正常系: 内部メモを追加する", async () => {
            // Given: 問い合わせが存在する
            await seedTestData({
                inquiries: [{ id: "inq-1", subject: "With Note", content: "Content" }],
            });

            // When: 内部メモとして AddInquiryResponseUseCase を実行
            const useCase = container.getAddInquiryResponseUseCase();
            const result = await useCase.execute("inq-1", {
                content: "Internal note: Customer is VIP",
                isInternal: true,
            });

            // Then: 内部メモが追加される
            expect(result.isInternal).toBe(true);
        });
    });
});
