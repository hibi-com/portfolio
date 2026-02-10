import type {
	CreateLeadInput,
	Lead,
	LeadsListLeads200,
	LeadsListLeadsParams,
	UpdateLeadInput,
} from "@generated/api.schemas";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@generated/leads/leads", () => ({
	getLeads: vi.fn(() => ({
		leadsListLeads: vi.fn(),
		leadsGetLeadById: vi.fn(),
		leadsCreateLead: vi.fn(),
		leadsUpdateLead: vi.fn(),
		leadsDeleteLead: vi.fn(),
		leadsConvertLead: vi.fn(),
	})),
}));

import { getLeads } from "@generated/leads/leads";
import { convertLead, createLead, deleteLead, getLeadById, leads, listLeads, updateLead } from "./leads";

describe("leads client", () => {
	const mockLeadsListLeads = vi.fn();
	const mockLeadsGetLeadById = vi.fn();
	const mockLeadsCreateLead = vi.fn();
	const mockLeadsUpdateLead = vi.fn();
	const mockLeadsDeleteLead = vi.fn();
	const mockLeadsConvertLead = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getLeads).mockReturnValue({
			leadsListLeads: mockLeadsListLeads,
			leadsGetLeadById: mockLeadsGetLeadById,
			leadsCreateLead: mockLeadsCreateLead,
			leadsUpdateLead: mockLeadsUpdateLead,
			leadsDeleteLead: mockLeadsDeleteLead,
			leadsConvertLead: mockLeadsConvertLead,
		});
	});

	const mockLead: Lead = {
		id: "lead-123",
		name: "Test Lead",
		email: "lead@example.com",
		status: "NEW",
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	};

	describe("listLeads", () => {
		describe("正常系", () => {
			test("パラメータなしで全リードを取得する", async () => {
				const mockResponse: LeadsListLeads200 = {
					data: [mockLead],
					meta: { total: 1, page: 1, perPage: 10, totalPages: 1 },
				};
				mockLeadsListLeads.mockResolvedValue(mockResponse);

				const result = await listLeads();

				expect(result).toEqual(mockResponse);
				expect(mockLeadsListLeads).toHaveBeenCalledWith(undefined);
			});

			test("ステータスフィルターを渡してリードを取得する", async () => {
				const params: LeadsListLeadsParams = { status: "QUALIFIED" };
				const mockResponse: LeadsListLeads200 = {
					data: [{ ...mockLead, status: "QUALIFIED" }],
					meta: { total: 1, page: 1, perPage: 10, totalPages: 1 },
				};
				mockLeadsListLeads.mockResolvedValue(mockResponse);

				const result = await listLeads(params);

				expect(result).toEqual(mockResponse);
				expect(mockLeadsListLeads).toHaveBeenCalledWith(params);
			});
		});

		describe("異常系", () => {
			test("APIエラーの場合はエラーをそのまま伝播する", async () => {
				const error = new Error("API Error");
				mockLeadsListLeads.mockRejectedValue(error);

				await expect(listLeads()).rejects.toThrow("API Error");
			});
		});
	});

	describe("getLeadById", () => {
		describe("正常系", () => {
			test("IDでリードを取得する", async () => {
				mockLeadsGetLeadById.mockResolvedValue(mockLead);

				const result = await getLeadById("lead-123");

				expect(result).toEqual(mockLead);
				expect(mockLeadsGetLeadById).toHaveBeenCalledWith("lead-123");
			});
		});

		describe("異常系", () => {
			test("存在しないIDの場合はAPIエラーを伝播する", async () => {
				const error = new Error("Not Found");
				mockLeadsGetLeadById.mockRejectedValue(error);

				await expect(getLeadById("non-existent")).rejects.toThrow("Not Found");
			});
		});
	});

	describe("createLead", () => {
		describe("正常系", () => {
			test("リードを作成する", async () => {
				const input: CreateLeadInput = {
					name: "New Lead",
					email: "new@example.com",
					source: "website",
				};
				mockLeadsCreateLead.mockResolvedValue(mockLead);

				const result = await createLead(input);

				expect(result).toEqual(mockLead);
				expect(mockLeadsCreateLead).toHaveBeenCalledWith(input);
			});

			test("スコア付きでリードを作成する", async () => {
				const input: CreateLeadInput = {
					name: "Scored Lead",
					score: 75,
				};
				const leadWithScore = { ...mockLead, score: 75 };
				mockLeadsCreateLead.mockResolvedValue(leadWithScore);

				const result = await createLead(input);

				expect(result.score).toBe(75);
			});
		});
	});

	describe("updateLead", () => {
		describe("正常系", () => {
			test("リードを更新する", async () => {
				const input: UpdateLeadInput = { status: "CONTACTED" };
				const updatedLead = { ...mockLead, status: "CONTACTED" };
				mockLeadsUpdateLead.mockResolvedValue(updatedLead);

				const result = await updateLead("lead-123", input);

				expect(result.status).toBe("CONTACTED");
				expect(mockLeadsUpdateLead).toHaveBeenCalledWith("lead-123", input);
			});

			test("スコアを更新する", async () => {
				const input: UpdateLeadInput = { score: 90 };
				const updatedLead = { ...mockLead, score: 90 };
				mockLeadsUpdateLead.mockResolvedValue(updatedLead);

				const result = await updateLead("lead-123", input);

				expect(result.score).toBe(90);
			});
		});
	});

	describe("deleteLead", () => {
		describe("正常系", () => {
			test("リードを削除する", async () => {
				mockLeadsDeleteLead.mockResolvedValue(undefined);

				await deleteLead("lead-123");

				expect(mockLeadsDeleteLead).toHaveBeenCalledWith("lead-123");
			});
		});
	});

	describe("convertLead", () => {
		describe("正常系", () => {
			test("リードを顧客に変換する", async () => {
				const convertedLead: Lead = {
					...mockLead,
					status: "CONVERTED",
					convertedAt: "2024-06-01T00:00:00Z",
				};
				mockLeadsConvertLead.mockResolvedValue(convertedLead);

				const result = await convertLead("lead-123");

				expect(result.status).toBe("CONVERTED");
				expect(result.convertedAt).toBeDefined();
				expect(mockLeadsConvertLead).toHaveBeenCalledWith("lead-123");
			});
		});

		describe("異常系", () => {
			test("既に変換済みの場合はエラーを伝播する", async () => {
				const error = new Error("Lead already converted");
				mockLeadsConvertLead.mockRejectedValue(error);

				await expect(convertLead("lead-123")).rejects.toThrow("Lead already converted");
			});
		});
	});

	describe("leads オブジェクト", () => {
		test("listメソッドが正しく動作する", async () => {
			const mockResponse: LeadsListLeads200 = {
				data: [],
				meta: { total: 0, page: 1, perPage: 10, totalPages: 0 },
			};
			mockLeadsListLeads.mockResolvedValue(mockResponse);

			const result = await leads.list();

			expect(result).toEqual(mockResponse);
		});

		test("getByIdメソッドが正しく動作する", async () => {
			mockLeadsGetLeadById.mockResolvedValue(mockLead);

			const result = await leads.getById("lead-123");

			expect(result).toEqual(mockLead);
		});

		test("createメソッドが正しく動作する", async () => {
			mockLeadsCreateLead.mockResolvedValue(mockLead);

			const result = await leads.create({ name: "Test" });

			expect(result).toEqual(mockLead);
		});

		test("updateメソッドが正しく動作する", async () => {
			mockLeadsUpdateLead.mockResolvedValue(mockLead);

			const result = await leads.update("lead-123", { name: "Updated" });

			expect(result).toEqual(mockLead);
		});

		test("deleteメソッドが正しく動作する", async () => {
			mockLeadsDeleteLead.mockResolvedValue(undefined);

			await leads.delete("lead-123");

			expect(mockLeadsDeleteLead).toHaveBeenCalledWith("lead-123");
		});

		test("convertメソッドが正しく動作する", async () => {
			const convertedLead = { ...mockLead, status: "CONVERTED" };
			mockLeadsConvertLead.mockResolvedValue(convertedLead);

			const result = await leads.convert("lead-123");

			expect(result.status).toBe("CONVERTED");
		});
	});
});
