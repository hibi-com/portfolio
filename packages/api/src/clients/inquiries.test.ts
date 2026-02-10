import type {
	CreateInquiryInput,
	CreateInquiryResponseInput,
	InquiriesListInquiries200,
	InquiriesListInquiriesParams,
	Inquiry,
	InquiryResponse,
	UpdateInquiryInput,
} from "@generated/api.schemas";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@generated/inquiries/inquiries", () => ({
	getInquiries: vi.fn(() => ({
		inquiriesListInquiries: vi.fn(),
		inquiriesGetInquiryById: vi.fn(),
		inquiriesCreateInquiry: vi.fn(),
		inquiriesUpdateInquiry: vi.fn(),
		inquiriesDeleteInquiry: vi.fn(),
		inquiriesResolveInquiry: vi.fn(),
		inquiriesCloseInquiry: vi.fn(),
		inquiriesGetInquiryResponses: vi.fn(),
		inquiriesAddInquiryResponse: vi.fn(),
	})),
}));

import { getInquiries } from "@generated/inquiries/inquiries";
import {
	addInquiryResponse,
	closeInquiry,
	createInquiry,
	deleteInquiry,
	getInquiryById,
	getInquiryResponses,
	inquiries,
	listInquiries,
	resolveInquiry,
	updateInquiry,
} from "./inquiries";

describe("inquiries client", () => {
	const mockInquiriesListInquiries = vi.fn();
	const mockInquiriesGetInquiryById = vi.fn();
	const mockInquiriesCreateInquiry = vi.fn();
	const mockInquiriesUpdateInquiry = vi.fn();
	const mockInquiriesDeleteInquiry = vi.fn();
	const mockInquiriesResolveInquiry = vi.fn();
	const mockInquiriesCloseInquiry = vi.fn();
	const mockInquiriesGetInquiryResponses = vi.fn();
	const mockInquiriesAddInquiryResponse = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getInquiries).mockReturnValue({
			inquiriesListInquiries: mockInquiriesListInquiries,
			inquiriesGetInquiryById: mockInquiriesGetInquiryById,
			inquiriesCreateInquiry: mockInquiriesCreateInquiry,
			inquiriesUpdateInquiry: mockInquiriesUpdateInquiry,
			inquiriesDeleteInquiry: mockInquiriesDeleteInquiry,
			inquiriesResolveInquiry: mockInquiriesResolveInquiry,
			inquiriesCloseInquiry: mockInquiriesCloseInquiry,
			inquiriesGetInquiryResponses: mockInquiriesGetInquiryResponses,
			inquiriesAddInquiryResponse: mockInquiriesAddInquiryResponse,
		});
	});

	const mockInquiry: Inquiry = {
		id: "inq-123",
		subject: "Help needed",
		content: "I have a question",
		status: "OPEN",
		priority: "MEDIUM",
		category: "GENERAL",
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	};

	const mockResponse: InquiryResponse = {
		id: "resp-123",
		inquiryId: "inq-123",
		content: "Here is the answer",
		isInternal: false,
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	};

	describe("listInquiries", () => {
		describe("正常系", () => {
			test("パラメータなしで全問い合わせを取得する", async () => {
				const mockListResponse: InquiriesListInquiries200 = {
					data: [mockInquiry],
					meta: { total: 1, page: 1, perPage: 10, totalPages: 1 },
				};
				mockInquiriesListInquiries.mockResolvedValue(mockListResponse);

				const result = await listInquiries();

				expect(result).toEqual(mockListResponse);
				expect(mockInquiriesListInquiries).toHaveBeenCalledWith(undefined);
			});

			test("ステータスフィルターを渡して問い合わせを取得する", async () => {
				const params: InquiriesListInquiriesParams = { status: "OPEN" };
				const mockListResponse: InquiriesListInquiries200 = {
					data: [mockInquiry],
					meta: { total: 1, page: 1, perPage: 10, totalPages: 1 },
				};
				mockInquiriesListInquiries.mockResolvedValue(mockListResponse);

				await listInquiries(params);

				expect(mockInquiriesListInquiries).toHaveBeenCalledWith(params);
			});

			test("担当者IDでフィルターを渡して問い合わせを取得する", async () => {
				const params: InquiriesListInquiriesParams = { assigneeId: "user-123" };
				mockInquiriesListInquiries.mockResolvedValue({
					data: [],
					meta: { total: 0, page: 1, perPage: 10, totalPages: 0 },
				});

				await listInquiries(params);

				expect(mockInquiriesListInquiries).toHaveBeenCalledWith(params);
			});
		});
	});

	describe("getInquiryById", () => {
		describe("正常系", () => {
			test("IDで問い合わせを取得する", async () => {
				mockInquiriesGetInquiryById.mockResolvedValue(mockInquiry);

				const result = await getInquiryById("inq-123");

				expect(result).toEqual(mockInquiry);
				expect(mockInquiriesGetInquiryById).toHaveBeenCalledWith("inq-123");
			});
		});
	});

	describe("createInquiry", () => {
		describe("正常系", () => {
			test("問い合わせを作成する", async () => {
				const input: CreateInquiryInput = {
					subject: "New Inquiry",
					content: "New content",
					priority: "HIGH",
					category: "TECHNICAL",
				};
				mockInquiriesCreateInquiry.mockResolvedValue({ ...mockInquiry, ...input });

				const result = await createInquiry(input);

				expect(result.subject).toBe("New Inquiry");
				expect(mockInquiriesCreateInquiry).toHaveBeenCalledWith(input);
			});

			test("顧客IDを指定して問い合わせを作成する", async () => {
				const input: CreateInquiryInput = {
					subject: "Customer Inquiry",
					content: "Content",
					customerId: "cust-123",
				};
				mockInquiriesCreateInquiry.mockResolvedValue({ ...mockInquiry, customerId: "cust-123" });

				const result = await createInquiry(input);

				expect(result.customerId).toBe("cust-123");
			});
		});
	});

	describe("updateInquiry", () => {
		describe("正常系", () => {
			test("問い合わせを更新する", async () => {
				const input: UpdateInquiryInput = { priority: "URGENT" };
				const updatedInquiry = { ...mockInquiry, priority: "URGENT" };
				mockInquiriesUpdateInquiry.mockResolvedValue(updatedInquiry);

				const result = await updateInquiry("inq-123", input);

				expect(result.priority).toBe("URGENT");
				expect(mockInquiriesUpdateInquiry).toHaveBeenCalledWith("inq-123", input);
			});

			test("担当者を割り当てる", async () => {
				const input: UpdateInquiryInput = { assigneeId: "user-456" };
				const updatedInquiry = { ...mockInquiry, assigneeId: "user-456" };
				mockInquiriesUpdateInquiry.mockResolvedValue(updatedInquiry);

				const result = await updateInquiry("inq-123", input);

				expect(result.assigneeId).toBe("user-456");
			});
		});
	});

	describe("deleteInquiry", () => {
		describe("正常系", () => {
			test("問い合わせを削除する", async () => {
				mockInquiriesDeleteInquiry.mockResolvedValue(undefined);

				await deleteInquiry("inq-123");

				expect(mockInquiriesDeleteInquiry).toHaveBeenCalledWith("inq-123");
			});
		});
	});

	describe("resolveInquiry", () => {
		describe("正常系", () => {
			test("問い合わせを解決済みにする", async () => {
				const resolvedInquiry: Inquiry = {
					...mockInquiry,
					status: "RESOLVED",
					resolvedAt: "2024-06-01T00:00:00Z",
				};
				mockInquiriesResolveInquiry.mockResolvedValue(resolvedInquiry);

				const result = await resolveInquiry("inq-123");

				expect(result.status).toBe("RESOLVED");
				expect(result.resolvedAt).toBeDefined();
				expect(mockInquiriesResolveInquiry).toHaveBeenCalledWith("inq-123");
			});
		});
	});

	describe("closeInquiry", () => {
		describe("正常系", () => {
			test("問い合わせをクローズする", async () => {
				const closedInquiry: Inquiry = {
					...mockInquiry,
					status: "CLOSED",
					closedAt: "2024-06-01T00:00:00Z",
				};
				mockInquiriesCloseInquiry.mockResolvedValue(closedInquiry);

				const result = await closeInquiry("inq-123");

				expect(result.status).toBe("CLOSED");
				expect(result.closedAt).toBeDefined();
				expect(mockInquiriesCloseInquiry).toHaveBeenCalledWith("inq-123");
			});
		});
	});

	describe("getInquiryResponses", () => {
		describe("正常系", () => {
			test("問い合わせの返信一覧を取得する", async () => {
				mockInquiriesGetInquiryResponses.mockResolvedValue([mockResponse]);

				const result = await getInquiryResponses("inq-123");

				expect(result).toEqual([mockResponse]);
				expect(mockInquiriesGetInquiryResponses).toHaveBeenCalledWith("inq-123");
			});

			test("返信がない場合は空配列を返す", async () => {
				mockInquiriesGetInquiryResponses.mockResolvedValue([]);

				const result = await getInquiryResponses("inq-123");

				expect(result).toEqual([]);
			});
		});
	});

	describe("addInquiryResponse", () => {
		describe("正常系", () => {
			test("問い合わせに返信を追加する", async () => {
				const input: CreateInquiryResponseInput = {
					inquiryId: "inq-123",
					content: "New response",
				};
				mockInquiriesAddInquiryResponse.mockResolvedValue({ ...mockResponse, content: "New response" });

				const result = await addInquiryResponse("inq-123", input);

				expect(result.content).toBe("New response");
				expect(mockInquiriesAddInquiryResponse).toHaveBeenCalledWith("inq-123", input);
			});

			test("内部メモとして返信を追加する", async () => {
				const input: CreateInquiryResponseInput = {
					inquiryId: "inq-123",
					content: "Internal note",
					isInternal: true,
				};
				const internalResponse = { ...mockResponse, content: "Internal note", isInternal: true };
				mockInquiriesAddInquiryResponse.mockResolvedValue(internalResponse);

				const result = await addInquiryResponse("inq-123", input);

				expect(result.isInternal).toBe(true);
			});
		});
	});

	describe("inquiries オブジェクト", () => {
		test("listメソッドが正しく動作する", async () => {
			const mockListResponse: InquiriesListInquiries200 = {
				data: [],
				meta: { total: 0, page: 1, perPage: 10, totalPages: 0 },
			};
			mockInquiriesListInquiries.mockResolvedValue(mockListResponse);

			const result = await inquiries.list();

			expect(result).toEqual(mockListResponse);
		});

		test("resolveメソッドが正しく動作する", async () => {
			mockInquiriesResolveInquiry.mockResolvedValue({ ...mockInquiry, status: "RESOLVED" });

			const result = await inquiries.resolve("inq-123");

			expect(result.status).toBe("RESOLVED");
		});

		test("closeメソッドが正しく動作する", async () => {
			mockInquiriesCloseInquiry.mockResolvedValue({ ...mockInquiry, status: "CLOSED" });

			const result = await inquiries.close("inq-123");

			expect(result.status).toBe("CLOSED");
		});

		test("getResponsesメソッドが正しく動作する", async () => {
			mockInquiriesGetInquiryResponses.mockResolvedValue([mockResponse]);

			const result = await inquiries.getResponses("inq-123");

			expect(result).toEqual([mockResponse]);
		});

		test("addResponseメソッドが正しく動作する", async () => {
			mockInquiriesAddInquiryResponse.mockResolvedValue(mockResponse);

			const result = await inquiries.addResponse("inq-123", { inquiryId: "inq-123", content: "Response" });

			expect(result).toEqual(mockResponse);
		});
	});
});
