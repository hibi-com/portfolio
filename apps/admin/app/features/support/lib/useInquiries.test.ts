import type { Inquiry, InquiryResponse } from "@portfolio/api";
import { inquiries as inquiriesApi } from "@portfolio/api";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useInquiries, useInquiryDetail } from "./useInquiries";

vi.mock("@portfolio/api", () => ({
    inquiries: {
        list: vi.fn(),
        getById: vi.fn(),
        getResponses: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        close: vi.fn(),
        addResponse: vi.fn(),
    },
}));

describe("useInquiries", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("fetchInquiries", () => {
        describe("正常系", () => {
            test("初期状態は空配列とloading trueである", () => {
                vi.mocked(inquiriesApi.list).mockResolvedValue({ data: [] } as never);

                const { result } = renderHook(() => useInquiries());

                expect(result.current.inquiries).toEqual([]);
                expect(result.current.loading).toBe(true);
                expect(result.current.error).toBeNull();
            });

            test("問い合わせリストを取得して更新する", async () => {
                const mockInquiries: Inquiry[] = [
                    {
                        id: "1",
                        subject: "Test Inquiry",
                        content: "Test content",
                        type: "QUESTION",
                        status: "OPEN",
                        priority: "MEDIUM",
                        email: "test@example.com",
                        name: "Test User",
                        createdAt: "2024-01-01",
                        updatedAt: "2024-01-01",
                    },
                ];

                vi.mocked(inquiriesApi.list).mockResolvedValue({ data: mockInquiries } as never);

                const { result } = renderHook(() => useInquiries());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.inquiries).toEqual(mockInquiries);
                expect(inquiriesApi.list).toHaveBeenCalled();
            });

            test("dataがnullの場合は空配列を設定する", async () => {
                vi.mocked(inquiriesApi.list).mockResolvedValue({ data: null } as never);

                const { result } = renderHook(() => useInquiries());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.inquiries).toEqual([]);
            });

            test("配列が直接返却される場合も処理する", async () => {
                const mockInquiries: Inquiry[] = [
                    {
                        id: "1",
                        subject: "Test Inquiry",
                        content: "Test content",
                        type: "QUESTION",
                        status: "OPEN",
                        priority: "MEDIUM",
                        email: "test@example.com",
                        name: "Test User",
                        createdAt: "2024-01-01",
                        updatedAt: "2024-01-01",
                    },
                ];

                vi.mocked(inquiriesApi.list).mockResolvedValue(mockInquiries as never);

                const { result } = renderHook(() => useInquiries());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.inquiries).toEqual(mockInquiries);
            });
        });

        describe("異常系", () => {
            test("エラーが発生した場合はエラー状態を設定する", async () => {
                const error = new Error("Failed to fetch");
                vi.mocked(inquiriesApi.list).mockRejectedValue(error);

                const { result } = renderHook(() => useInquiries());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.error).toBeInstanceOf(Error);
                expect(result.current.error?.message).toContain("Failed to fetch");
                expect(result.current.inquiries).toEqual([]);
            });
        });
    });

    describe("createInquiry", () => {
        describe("正常系", () => {
            test("新規問い合わせを作成してリストの先頭に追加する", async () => {
                const existingInquiry: Inquiry = {
                    id: "1",
                    subject: "Existing",
                    content: "Existing content",
                    type: "QUESTION",
                    status: "OPEN",
                    priority: "MEDIUM",
                    email: "existing@example.com",
                    name: "Existing User",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const newInquiry: Inquiry = {
                    id: "2",
                    subject: "New Inquiry",
                    content: "New content",
                    type: "BUG_REPORT",
                    status: "OPEN",
                    priority: "HIGH",
                    email: "new@example.com",
                    name: "New User",
                    createdAt: "2024-01-02",
                    updatedAt: "2024-01-02",
                };

                vi.mocked(inquiriesApi.list).mockResolvedValue([existingInquiry] as never);
                vi.mocked(inquiriesApi.create).mockResolvedValue(newInquiry as never);

                const { result } = renderHook(() => useInquiries());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                const created = await result.current.createInquiry({
                    subject: "New Inquiry",
                    content: "New content",
                    type: "BUG_REPORT",
                    email: "new@example.com",
                    name: "New User",
                });

                expect(created).toEqual(newInquiry);
                expect(result.current.inquiries).toEqual([newInquiry, existingInquiry]);
            });
        });

        describe("異常系", () => {
            test("作成に失敗した場合はエラーをthrowする", async () => {
                vi.mocked(inquiriesApi.list).mockResolvedValue([] as never);
                const error = new Error("Create failed");
                vi.mocked(inquiriesApi.create).mockRejectedValue(error);

                const { result } = renderHook(() => useInquiries());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await expect(
                    result.current.createInquiry({
                        subject: "Test",
                        content: "Test content",
                        type: "QUESTION",
                        email: "test@example.com",
                        name: "Test User",
                    }),
                ).rejects.toThrow("Create failed");
            });
        });
    });

    describe("updateInquiry", () => {
        describe("正常系", () => {
            test("問い合わせを更新してリスト内の該当項目を置き換える", async () => {
                const inquiry: Inquiry = {
                    id: "1",
                    subject: "Original",
                    content: "Original content",
                    type: "QUESTION",
                    status: "OPEN",
                    priority: "MEDIUM",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const updatedInquiry: Inquiry = {
                    ...inquiry,
                    subject: "Updated",
                    status: "IN_PROGRESS",
                    updatedAt: "2024-01-02",
                };

                vi.mocked(inquiriesApi.list).mockResolvedValue([inquiry] as never);
                vi.mocked(inquiriesApi.update).mockResolvedValue(updatedInquiry as never);

                const { result } = renderHook(() => useInquiries());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                const updated = await result.current.updateInquiry("1", {
                    subject: "Updated",
                    status: "IN_PROGRESS",
                });

                expect(updated).toEqual(updatedInquiry);
                expect(result.current.inquiries).toEqual([updatedInquiry]);
            });
        });

        describe("異常系", () => {
            test("更新に失敗した場合はエラーをthrowする", async () => {
                const inquiry: Inquiry = {
                    id: "1",
                    subject: "Test",
                    content: "Test content",
                    type: "QUESTION",
                    status: "OPEN",
                    priority: "MEDIUM",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                vi.mocked(inquiriesApi.list).mockResolvedValue([inquiry] as never);
                const error = new Error("Update failed");
                vi.mocked(inquiriesApi.update).mockRejectedValue(error);

                const { result } = renderHook(() => useInquiries());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await expect(result.current.updateInquiry("1", { subject: "Updated" })).rejects.toThrow(
                    "Update failed",
                );
            });
        });
    });

    describe("closeInquiry", () => {
        describe("正常系", () => {
            test("問い合わせをクローズしてステータスを更新する", async () => {
                const inquiry: Inquiry = {
                    id: "1",
                    subject: "Test",
                    content: "Test content",
                    type: "QUESTION",
                    status: "OPEN",
                    priority: "MEDIUM",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const closedInquiry: Inquiry = {
                    ...inquiry,
                    status: "CLOSED",
                    updatedAt: "2024-01-02",
                };

                vi.mocked(inquiriesApi.list).mockResolvedValue([inquiry] as never);
                vi.mocked(inquiriesApi.close).mockResolvedValue(closedInquiry as never);

                const { result } = renderHook(() => useInquiries());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await result.current.closeInquiry("1");

                expect(result.current.inquiries).toEqual([closedInquiry]);
                expect(inquiriesApi.close).toHaveBeenCalledWith("1");
            });
        });

        describe("異常系", () => {
            test("クローズに失敗した場合はエラーをthrowする", async () => {
                const inquiry: Inquiry = {
                    id: "1",
                    subject: "Test",
                    content: "Test content",
                    type: "QUESTION",
                    status: "OPEN",
                    priority: "MEDIUM",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                vi.mocked(inquiriesApi.list).mockResolvedValue([inquiry] as never);
                const error = new Error("Close failed");
                vi.mocked(inquiriesApi.close).mockRejectedValue(error);

                const { result } = renderHook(() => useInquiries());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await expect(result.current.closeInquiry("1")).rejects.toThrow("Close failed");
            });
        });
    });
});

describe("useInquiryDetail", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("fetchInquiry", () => {
        describe("正常系", () => {
            test("初期状態はnullとloading trueである", () => {
                vi.mocked(inquiriesApi.getById).mockResolvedValue({} as never);
                vi.mocked(inquiriesApi.getResponses).mockResolvedValue([] as never);

                const { result } = renderHook(() => useInquiryDetail("1"));

                expect(result.current.inquiry).toBeNull();
                expect(result.current.loading).toBe(true);
                expect(result.current.error).toBeNull();
            });

            test("問い合わせ詳細とレスポンスを取得する", async () => {
                const mockInquiry: Inquiry = {
                    id: "1",
                    subject: "Test Inquiry",
                    content: "Test content",
                    type: "QUESTION",
                    status: "OPEN",
                    priority: "MEDIUM",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const mockResponses: InquiryResponse[] = [
                    {
                        id: "r1",
                        inquiryId: "1",
                        content: "Response 1",
                        isInternal: false,
                        createdAt: "2024-01-01",
                        updatedAt: "2024-01-01",
                    },
                ];

                vi.mocked(inquiriesApi.getById).mockResolvedValue(mockInquiry as never);
                vi.mocked(inquiriesApi.getResponses).mockResolvedValue(mockResponses as never);

                const { result } = renderHook(() => useInquiryDetail("1"));

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.inquiry).toEqual({
                    ...mockInquiry,
                    responses: mockResponses,
                });
                expect(inquiriesApi.getById).toHaveBeenCalledWith("1");
                expect(inquiriesApi.getResponses).toHaveBeenCalledWith("1");
            });
        });

        describe("異常系", () => {
            test("エラーが発生した場合はエラー状態を設定する", async () => {
                const error = new Error("Failed to fetch");
                vi.mocked(inquiriesApi.getById).mockRejectedValue(error);
                vi.mocked(inquiriesApi.getResponses).mockResolvedValue([] as never);

                const { result } = renderHook(() => useInquiryDetail("1"));

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.error).toBeInstanceOf(Error);
                expect(result.current.error?.message).toContain("Failed to fetch");
                expect(result.current.inquiry).toBeNull();
            });
        });
    });

    describe("respond", () => {
        describe("正常系", () => {
            test("レスポンスを追加して問い合わせのレスポンスリストに追加する", async () => {
                const mockInquiry: Inquiry = {
                    id: "1",
                    subject: "Test",
                    content: "Test content",
                    type: "QUESTION",
                    status: "OPEN",
                    priority: "MEDIUM",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const existingResponse: InquiryResponse = {
                    id: "r1",
                    inquiryId: "1",
                    content: "Existing response",
                    isInternal: false,
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const newResponse: InquiryResponse = {
                    id: "r2",
                    inquiryId: "1",
                    content: "New response",
                    isInternal: false,
                    userId: "user-1",
                    createdAt: "2024-01-02",
                    updatedAt: "2024-01-02",
                };

                vi.mocked(inquiriesApi.getById).mockResolvedValue(mockInquiry as never);
                vi.mocked(inquiriesApi.getResponses).mockResolvedValue([existingResponse] as never);
                vi.mocked(inquiriesApi.addResponse).mockResolvedValue(newResponse as never);

                const { result } = renderHook(() => useInquiryDetail("1"));

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                const added = await result.current.respond({
                    message: "New response",
                    isInternal: false,
                });

                expect(added).toEqual(newResponse);
                expect(result.current.inquiry?.responses).toEqual([existingResponse, newResponse]);
            });
        });

        describe("異常系", () => {
            test("レスポンス追加に失敗した場合はエラーをthrowする", async () => {
                const mockInquiry: Inquiry = {
                    id: "1",
                    subject: "Test",
                    content: "Test content",
                    type: "QUESTION",
                    status: "OPEN",
                    priority: "MEDIUM",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                vi.mocked(inquiriesApi.getById).mockResolvedValue(mockInquiry as never);
                vi.mocked(inquiriesApi.getResponses).mockResolvedValue([] as never);
                const error = new Error("Response failed");
                vi.mocked(inquiriesApi.addResponse).mockRejectedValue(error);

                const { result } = renderHook(() => useInquiryDetail("1"));

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await expect(
                    result.current.respond({
                        message: "Test response",
                        isInternal: false,
                    }),
                ).rejects.toThrow("Response failed");
            });
        });
    });
});
