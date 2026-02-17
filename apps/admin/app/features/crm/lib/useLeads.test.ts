import type { Lead } from "@portfolio/api";
import { leads as leadsApi } from "@portfolio/api";
import { renderHook, waitFor } from "@testing-library/react";
import { useLeads } from "./useLeads";

vi.mock("@portfolio/api", () => ({
    leads: {
        list: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        convert: vi.fn(),
    },
}));

describe("useLeads", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("fetchLeads", () => {
        describe("正常系", () => {
            test("初期状態は空配列とloading trueである", () => {
                vi.mocked(leadsApi.list).mockResolvedValue({ data: [] } as never);

                const { result } = renderHook(() => useLeads());

                expect(result.current.leads).toEqual([]);
                expect(result.current.loading).toBe(true);
                expect(result.current.error).toBeNull();
            });

            test("Leadsを取得して更新する", async () => {
                const mockLeads: Lead[] = [
                    {
                        id: "1",
                        name: "Test Lead",
                        email: "test@example.com",
                        status: "NEW",
                        source: "WEBSITE",
                        createdAt: "2024-01-01",
                        updatedAt: "2024-01-01",
                    },
                ];

                vi.mocked(leadsApi.list).mockResolvedValue({ data: mockLeads } as never);

                const { result } = renderHook(() => useLeads());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.leads).toEqual(mockLeads);
                expect(leadsApi.list).toHaveBeenCalled();
            });

            test("dataがnullの場合は空配列を設定する", async () => {
                vi.mocked(leadsApi.list).mockResolvedValue({ data: null } as never);

                const { result } = renderHook(() => useLeads());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.leads).toEqual([]);
            });

            test("配列が直接返却される場合も処理する", async () => {
                const mockLeads: Lead[] = [
                    {
                        id: "1",
                        name: "Test Lead",
                        email: "test@example.com",
                        status: "NEW",
                        source: "WEBSITE",
                        createdAt: "2024-01-01",
                        updatedAt: "2024-01-01",
                    },
                ];

                vi.mocked(leadsApi.list).mockResolvedValue(mockLeads as never);

                const { result } = renderHook(() => useLeads());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.leads).toEqual(mockLeads);
            });
        });

        describe("異常系", () => {
            test("エラーが発生した場合はエラー状態を設定する", async () => {
                const error = new Error("Failed to fetch");
                vi.mocked(leadsApi.list).mockRejectedValue(error);

                const { result } = renderHook(() => useLeads());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.error).toBeInstanceOf(Error);
                expect(result.current.error?.message).toContain("Failed to fetch");
                expect(result.current.leads).toEqual([]);
            });
        });
    });

    describe("createLead", () => {
        describe("正常系", () => {
            test("新規Leadを作成してリストの先頭に追加する", async () => {
                const existingLead: Lead = {
                    id: "1",
                    name: "Existing Lead",
                    email: "existing@example.com",
                    status: "NEW",
                    source: "WEBSITE",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const newLead: Lead = {
                    id: "2",
                    name: "New Lead",
                    email: "new@example.com",
                    status: "NEW",
                    source: "REFERRAL",
                    createdAt: "2024-01-02",
                    updatedAt: "2024-01-02",
                };

                vi.mocked(leadsApi.list).mockResolvedValue([existingLead] as never);
                vi.mocked(leadsApi.create).mockResolvedValue(newLead as never);

                const { result } = renderHook(() => useLeads());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                const created = await result.current.createLead({
                    name: "New Lead",
                    email: "new@example.com",
                    source: "REFERRAL",
                });

                expect(created).toEqual(newLead);
                expect(result.current.leads).toEqual([newLead, existingLead]);
            });
        });

        describe("異常系", () => {
            test("作成に失敗した場合はエラーをthrowする", async () => {
                vi.mocked(leadsApi.list).mockResolvedValue([] as never);
                const error = new Error("Create failed");
                vi.mocked(leadsApi.create).mockRejectedValue(error);

                const { result } = renderHook(() => useLeads());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await expect(
                    result.current.createLead({
                        name: "Test",
                        email: "test@example.com",
                        source: "WEBSITE",
                    }),
                ).rejects.toThrow("Create failed");
            });
        });
    });

    describe("updateLead", () => {
        describe("正常系", () => {
            test("Leadを更新してリスト内の該当項目を置き換える", async () => {
                const lead: Lead = {
                    id: "1",
                    name: "Original",
                    email: "original@example.com",
                    status: "NEW",
                    source: "WEBSITE",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const updatedLead: Lead = {
                    ...lead,
                    name: "Updated",
                    status: "CONTACTED",
                    updatedAt: "2024-01-02",
                };

                vi.mocked(leadsApi.list).mockResolvedValue([lead] as never);
                vi.mocked(leadsApi.update).mockResolvedValue(updatedLead as never);

                const { result } = renderHook(() => useLeads());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                const updated = await result.current.updateLead("1", {
                    name: "Updated",
                    status: "CONTACTED",
                });

                expect(updated).toEqual(updatedLead);
                expect(result.current.leads).toEqual([updatedLead]);
            });
        });

        describe("異常系", () => {
            test("更新に失敗した場合はエラーをthrowする", async () => {
                const lead: Lead = {
                    id: "1",
                    name: "Test",
                    email: "test@example.com",
                    status: "NEW",
                    source: "WEBSITE",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                vi.mocked(leadsApi.list).mockResolvedValue([lead] as never);
                const error = new Error("Update failed");
                vi.mocked(leadsApi.update).mockRejectedValue(error);

                const { result } = renderHook(() => useLeads());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await expect(result.current.updateLead("1", { name: "Updated" })).rejects.toThrow("Update failed");
            });
        });
    });

    describe("deleteLead", () => {
        describe("正常系", () => {
            test("Leadを削除してリストから除外する", async () => {
                const lead1: Lead = {
                    id: "1",
                    name: "Lead 1",
                    email: "lead1@example.com",
                    status: "NEW",
                    source: "WEBSITE",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const lead2: Lead = {
                    id: "2",
                    name: "Lead 2",
                    email: "lead2@example.com",
                    status: "NEW",
                    source: "REFERRAL",
                    createdAt: "2024-01-02",
                    updatedAt: "2024-01-02",
                };

                vi.mocked(leadsApi.list).mockResolvedValue([lead1, lead2] as never);
                vi.mocked(leadsApi.delete).mockResolvedValue(undefined as never);

                const { result } = renderHook(() => useLeads());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await result.current.deleteLead("1");

                expect(result.current.leads).toEqual([lead2]);
            });
        });

        describe("異常系", () => {
            test("削除に失敗した場合はエラーをthrowする", async () => {
                const lead: Lead = {
                    id: "1",
                    name: "Test",
                    email: "test@example.com",
                    status: "NEW",
                    source: "WEBSITE",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                vi.mocked(leadsApi.list).mockResolvedValue([lead] as never);
                const error = new Error("Delete failed");
                vi.mocked(leadsApi.delete).mockRejectedValue(error);

                const { result } = renderHook(() => useLeads());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await expect(result.current.deleteLead("1")).rejects.toThrow("Delete failed");
            });
        });
    });

    describe("convertLead", () => {
        describe("正常系", () => {
            test("Leadをコンバートしてリストから除外する", async () => {
                const lead1: Lead = {
                    id: "1",
                    name: "Lead to Convert",
                    email: "convert@example.com",
                    status: "QUALIFIED",
                    source: "WEBSITE",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const lead2: Lead = {
                    id: "2",
                    name: "Lead 2",
                    email: "lead2@example.com",
                    status: "NEW",
                    source: "REFERRAL",
                    createdAt: "2024-01-02",
                    updatedAt: "2024-01-02",
                };

                vi.mocked(leadsApi.list).mockResolvedValue([lead1, lead2] as never);
                vi.mocked(leadsApi.convert).mockResolvedValue(undefined as never);

                const { result } = renderHook(() => useLeads());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await result.current.convertLead("1");

                expect(result.current.leads).toEqual([lead2]);
                expect(leadsApi.convert).toHaveBeenCalledWith("1");
            });
        });

        describe("異常系", () => {
            test("コンバートに失敗した場合はエラーをthrowする", async () => {
                const lead: Lead = {
                    id: "1",
                    name: "Test",
                    email: "test@example.com",
                    status: "QUALIFIED",
                    source: "WEBSITE",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                vi.mocked(leadsApi.list).mockResolvedValue([lead] as never);
                const error = new Error("Convert failed");
                vi.mocked(leadsApi.convert).mockRejectedValue(error);

                const { result } = renderHook(() => useLeads());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await expect(result.current.convertLead("1")).rejects.toThrow("Convert failed");
            });
        });
    });
});
