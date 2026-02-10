import type {
	CreateDealInput,
	Deal,
	DealsListDeals200,
	DealsListDealsParams,
	UpdateDealInput,
} from "@generated/api.schemas";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@generated/deals/deals", () => ({
	getDeals: vi.fn(() => ({
		dealsListDeals: vi.fn(),
		dealsGetDealById: vi.fn(),
		dealsCreateDeal: vi.fn(),
		dealsUpdateDeal: vi.fn(),
		dealsDeleteDeal: vi.fn(),
		dealsMoveDealToStage: vi.fn(),
		dealsMarkDealAsWon: vi.fn(),
		dealsMarkDealAsLost: vi.fn(),
	})),
}));

import { getDeals } from "@generated/deals/deals";
import {
	createDeal,
	deals,
	deleteDeal,
	getDealById,
	listDeals,
	markDealAsLost,
	markDealAsWon,
	moveDealToStage,
	updateDeal,
} from "./deals";

describe("deals client", () => {
	const mockDealsListDeals = vi.fn();
	const mockDealsGetDealById = vi.fn();
	const mockDealsCreateDeal = vi.fn();
	const mockDealsUpdateDeal = vi.fn();
	const mockDealsDeleteDeal = vi.fn();
	const mockDealsMoveDealToStage = vi.fn();
	const mockDealsMarkDealAsWon = vi.fn();
	const mockDealsMarkDealAsLost = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getDeals).mockReturnValue({
			dealsListDeals: mockDealsListDeals,
			dealsGetDealById: mockDealsGetDealById,
			dealsCreateDeal: mockDealsCreateDeal,
			dealsUpdateDeal: mockDealsUpdateDeal,
			dealsDeleteDeal: mockDealsDeleteDeal,
			dealsMoveDealToStage: mockDealsMoveDealToStage,
			dealsMarkDealAsWon: mockDealsMarkDealAsWon,
			dealsMarkDealAsLost: mockDealsMarkDealAsLost,
		});
	});

	const mockDeal: Deal = {
		id: "deal-123",
		name: "Big Deal",
		stageId: "stage-1",
		value: 100000,
		currency: "JPY",
		status: "OPEN",
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	};

	describe("listDeals", () => {
		describe("正常系", () => {
			test("パラメータなしで全案件を取得する", async () => {
				const mockResponse: DealsListDeals200 = {
					data: [mockDeal],
					meta: { total: 1, page: 1, perPage: 10, totalPages: 1 },
				};
				mockDealsListDeals.mockResolvedValue(mockResponse);

				const result = await listDeals();

				expect(result).toEqual(mockResponse);
				expect(mockDealsListDeals).toHaveBeenCalledWith(undefined);
			});

			test("ステータスフィルターを渡して案件を取得する", async () => {
				const params: DealsListDealsParams = { status: "WON" };
				const mockResponse: DealsListDeals200 = {
					data: [{ ...mockDeal, status: "WON" }],
					meta: { total: 1, page: 1, perPage: 10, totalPages: 1 },
				};
				mockDealsListDeals.mockResolvedValue(mockResponse);

				const result = await listDeals(params);

				expect(result).toEqual(mockResponse);
				expect(mockDealsListDeals).toHaveBeenCalledWith(params);
			});

			test("顧客IDでフィルターする", async () => {
				const params: DealsListDealsParams = { customerId: "cust-123" };
				const mockResponse: DealsListDeals200 = {
					data: [mockDeal],
					meta: { total: 1, page: 1, perPage: 10, totalPages: 1 },
				};
				mockDealsListDeals.mockResolvedValue(mockResponse);

				await listDeals(params);

				expect(mockDealsListDeals).toHaveBeenCalledWith(params);
			});
		});
	});

	describe("getDealById", () => {
		describe("正常系", () => {
			test("IDで案件を取得する", async () => {
				mockDealsGetDealById.mockResolvedValue(mockDeal);

				const result = await getDealById("deal-123");

				expect(result).toEqual(mockDeal);
				expect(mockDealsGetDealById).toHaveBeenCalledWith("deal-123");
			});
		});
	});

	describe("createDeal", () => {
		describe("正常系", () => {
			test("案件を作成する", async () => {
				const input: CreateDealInput = {
					name: "New Deal",
					stageId: "stage-1",
					value: 50000,
				};
				mockDealsCreateDeal.mockResolvedValue(mockDeal);

				const result = await createDeal(input);

				expect(result).toEqual(mockDeal);
				expect(mockDealsCreateDeal).toHaveBeenCalledWith(input);
			});

			test("顧客IDとリードIDを指定して案件を作成する", async () => {
				const input: CreateDealInput = {
					name: "Customer Deal",
					stageId: "stage-1",
					customerId: "cust-123",
					leadId: "lead-456",
				};
				mockDealsCreateDeal.mockResolvedValue({ ...mockDeal, customerId: "cust-123", leadId: "lead-456" });

				const result = await createDeal(input);

				expect(result.customerId).toBe("cust-123");
				expect(result.leadId).toBe("lead-456");
			});
		});
	});

	describe("updateDeal", () => {
		describe("正常系", () => {
			test("案件を更新する", async () => {
				const input: UpdateDealInput = { value: 150000 };
				const updatedDeal = { ...mockDeal, value: 150000 };
				mockDealsUpdateDeal.mockResolvedValue(updatedDeal);

				const result = await updateDeal("deal-123", input);

				expect(result.value).toBe(150000);
				expect(mockDealsUpdateDeal).toHaveBeenCalledWith("deal-123", input);
			});
		});
	});

	describe("deleteDeal", () => {
		describe("正常系", () => {
			test("案件を削除する", async () => {
				mockDealsDeleteDeal.mockResolvedValue(undefined);

				await deleteDeal("deal-123");

				expect(mockDealsDeleteDeal).toHaveBeenCalledWith("deal-123");
			});
		});
	});

	describe("moveDealToStage", () => {
		describe("正常系", () => {
			test("案件を別のステージに移動する", async () => {
				const movedDeal = { ...mockDeal, stageId: "stage-2" };
				mockDealsMoveDealToStage.mockResolvedValue(movedDeal);

				const result = await moveDealToStage("deal-123", "stage-2");

				expect(result.stageId).toBe("stage-2");
				expect(mockDealsMoveDealToStage).toHaveBeenCalledWith("deal-123", { stageId: "stage-2" });
			});
		});
	});

	describe("markDealAsWon", () => {
		describe("正常系", () => {
			test("案件を成約にする", async () => {
				const wonDeal: Deal = {
					...mockDeal,
					status: "WON",
					actualCloseDate: "2024-06-01T00:00:00Z",
				};
				mockDealsMarkDealAsWon.mockResolvedValue(wonDeal);

				const result = await markDealAsWon("deal-123");

				expect(result.status).toBe("WON");
				expect(result.actualCloseDate).toBeDefined();
				expect(mockDealsMarkDealAsWon).toHaveBeenCalledWith("deal-123");
			});
		});
	});

	describe("markDealAsLost", () => {
		describe("正常系", () => {
			test("案件を失注にする（理由なし）", async () => {
				const lostDeal: Deal = {
					...mockDeal,
					status: "LOST",
				};
				mockDealsMarkDealAsLost.mockResolvedValue(lostDeal);

				const result = await markDealAsLost("deal-123");

				expect(result.status).toBe("LOST");
				expect(mockDealsMarkDealAsLost).toHaveBeenCalledWith("deal-123", undefined);
			});

			test("案件を失注にする（理由あり）", async () => {
				const lostDeal: Deal = {
					...mockDeal,
					status: "LOST",
					lostReason: "Budget constraints",
				};
				mockDealsMarkDealAsLost.mockResolvedValue(lostDeal);

				const result = await markDealAsLost("deal-123", "Budget constraints");

				expect(result.status).toBe("LOST");
				expect(result.lostReason).toBe("Budget constraints");
				expect(mockDealsMarkDealAsLost).toHaveBeenCalledWith("deal-123", { reason: "Budget constraints" });
			});
		});
	});

	describe("deals オブジェクト", () => {
		test("listメソッドが正しく動作する", async () => {
			const mockResponse: DealsListDeals200 = {
				data: [],
				meta: { total: 0, page: 1, perPage: 10, totalPages: 0 },
			};
			mockDealsListDeals.mockResolvedValue(mockResponse);

			const result = await deals.list();

			expect(result).toEqual(mockResponse);
		});

		test("getByIdメソッドが正しく動作する", async () => {
			mockDealsGetDealById.mockResolvedValue(mockDeal);

			const result = await deals.getById("deal-123");

			expect(result).toEqual(mockDeal);
		});

		test("moveToStageメソッドが正しく動作する", async () => {
			mockDealsMoveDealToStage.mockResolvedValue({ ...mockDeal, stageId: "stage-2" });

			const result = await deals.moveToStage("deal-123", "stage-2");

			expect(result.stageId).toBe("stage-2");
		});

		test("markAsWonメソッドが正しく動作する", async () => {
			mockDealsMarkDealAsWon.mockResolvedValue({ ...mockDeal, status: "WON" });

			const result = await deals.markAsWon("deal-123");

			expect(result.status).toBe("WON");
		});

		test("markAsLostメソッドが正しく動作する", async () => {
			mockDealsMarkDealAsLost.mockResolvedValue({ ...mockDeal, status: "LOST" });

			const result = await deals.markAsLost("deal-123", "Reason");

			expect(result.status).toBe("LOST");
		});
	});
});
