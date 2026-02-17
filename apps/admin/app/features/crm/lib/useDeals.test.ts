import type { Deal, Pipeline } from "@portfolio/api";
import { deals as dealsApi, pipelines as pipelinesApi } from "@portfolio/api";
import { renderHook, waitFor } from "@testing-library/react";
import { useDeals } from "./useDeals";

vi.mock("@portfolio/api", () => ({
    deals: {
        list: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        moveToStage: vi.fn(),
    },
    pipelines: {
        list: vi.fn(),
    },
}));

describe("useDeals", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("fetchData", () => {
        describe("正常系", () => {
            test("初期状態は空配列とloading trueである", () => {
                vi.mocked(dealsApi.list).mockResolvedValue({ data: [] } as never);
                vi.mocked(pipelinesApi.list).mockResolvedValue([] as never);

                const { result } = renderHook(() => useDeals());

                expect(result.current.deals).toEqual([]);
                expect(result.current.pipelines).toEqual([]);
                expect(result.current.loading).toBe(true);
                expect(result.current.error).toBeNull();
            });

            test("DealsとPipelinesを取得して更新する", async () => {
                const mockDeals: Deal[] = [
                    {
                        id: "1",
                        title: "Test Deal",
                        value: 10000,
                        customerId: "customer-1",
                        pipelineId: "pipeline-1",
                        stageId: "stage-1",
                        status: "OPEN",
                        createdAt: "2024-01-01",
                        updatedAt: "2024-01-01",
                    },
                ];

                const mockPipelines: Pipeline[] = [
                    {
                        id: "pipeline-1",
                        name: "Sales Pipeline",
                        stages: [
                            { id: "stage-1", name: "Prospecting", order: 1 },
                            { id: "stage-2", name: "Negotiation", order: 2 },
                        ],
                        createdAt: "2024-01-01",
                        updatedAt: "2024-01-01",
                    },
                ];

                vi.mocked(dealsApi.list).mockResolvedValue({ data: mockDeals } as never);
                vi.mocked(pipelinesApi.list).mockResolvedValue(mockPipelines as never);

                const { result } = renderHook(() => useDeals());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.deals).toEqual(mockDeals);
                expect(result.current.pipelines).toEqual(mockPipelines);
                expect(dealsApi.list).toHaveBeenCalled();
                expect(pipelinesApi.list).toHaveBeenCalled();
            });

            test("dataがnullの場合は空配列を設定する", async () => {
                vi.mocked(dealsApi.list).mockResolvedValue({ data: null } as never);
                vi.mocked(pipelinesApi.list).mockResolvedValue([] as never);

                const { result } = renderHook(() => useDeals());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.deals).toEqual([]);
            });

            test("配列が直接返却される場合も処理する", async () => {
                const mockDeals: Deal[] = [
                    {
                        id: "1",
                        title: "Test Deal",
                        value: 10000,
                        customerId: "customer-1",
                        pipelineId: "pipeline-1",
                        stageId: "stage-1",
                        status: "OPEN",
                        createdAt: "2024-01-01",
                        updatedAt: "2024-01-01",
                    },
                ];

                vi.mocked(dealsApi.list).mockResolvedValue(mockDeals as never);
                vi.mocked(pipelinesApi.list).mockResolvedValue([] as never);

                const { result } = renderHook(() => useDeals());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.deals).toEqual(mockDeals);
            });
        });

        describe("異常系", () => {
            test("エラーが発生した場合はエラー状態を設定する", async () => {
                const error = new Error("Failed to fetch");
                vi.mocked(dealsApi.list).mockRejectedValue(error);
                vi.mocked(pipelinesApi.list).mockResolvedValue([] as never);

                const { result } = renderHook(() => useDeals());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.error).toBeInstanceOf(Error);
                expect(result.current.error?.message).toContain("Failed to fetch");
                expect(result.current.deals).toEqual([]);
            });
        });
    });

    describe("createDeal", () => {
        describe("正常系", () => {
            test("新規Dealを作成してリストの先頭に追加する", async () => {
                const existingDeal: Deal = {
                    id: "1",
                    title: "Existing Deal",
                    value: 5000,
                    customerId: "customer-1",
                    pipelineId: "pipeline-1",
                    stageId: "stage-1",
                    status: "OPEN",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const newDeal: Deal = {
                    id: "2",
                    title: "New Deal",
                    value: 10000,
                    customerId: "customer-2",
                    pipelineId: "pipeline-1",
                    stageId: "stage-1",
                    status: "OPEN",
                    createdAt: "2024-01-02",
                    updatedAt: "2024-01-02",
                };

                vi.mocked(dealsApi.list).mockResolvedValue([existingDeal] as never);
                vi.mocked(pipelinesApi.list).mockResolvedValue([] as never);
                vi.mocked(dealsApi.create).mockResolvedValue(newDeal as never);

                const { result } = renderHook(() => useDeals());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                const created = await result.current.createDeal({
                    title: "New Deal",
                    value: 10000,
                    customerId: "customer-2",
                    pipelineId: "pipeline-1",
                    stageId: "stage-1",
                });

                expect(created).toEqual(newDeal);
                expect(result.current.deals).toEqual([newDeal, existingDeal]);
            });
        });

        describe("異常系", () => {
            test("作成に失敗した場合はエラーをthrowする", async () => {
                vi.mocked(dealsApi.list).mockResolvedValue([] as never);
                vi.mocked(pipelinesApi.list).mockResolvedValue([] as never);
                const error = new Error("Create failed");
                vi.mocked(dealsApi.create).mockRejectedValue(error);

                const { result } = renderHook(() => useDeals());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await expect(
                    result.current.createDeal({
                        title: "Test",
                        value: 1000,
                        customerId: "customer-1",
                        pipelineId: "pipeline-1",
                        stageId: "stage-1",
                    }),
                ).rejects.toThrow("Create failed");
            });
        });
    });

    describe("updateDeal", () => {
        describe("正常系", () => {
            test("Dealを更新してリスト内の該当項目を置き換える", async () => {
                const deal: Deal = {
                    id: "1",
                    title: "Original",
                    value: 5000,
                    customerId: "customer-1",
                    pipelineId: "pipeline-1",
                    stageId: "stage-1",
                    status: "OPEN",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const updatedDeal: Deal = {
                    ...deal,
                    title: "Updated",
                    value: 10000,
                    updatedAt: "2024-01-02",
                };

                vi.mocked(dealsApi.list).mockResolvedValue([deal] as never);
                vi.mocked(pipelinesApi.list).mockResolvedValue([] as never);
                vi.mocked(dealsApi.update).mockResolvedValue(updatedDeal as never);

                const { result } = renderHook(() => useDeals());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                const updated = await result.current.updateDeal("1", {
                    title: "Updated",
                    value: 10000,
                });

                expect(updated).toEqual(updatedDeal);
                expect(result.current.deals).toEqual([updatedDeal]);
            });
        });

        describe("異常系", () => {
            test("更新に失敗した場合はエラーをthrowする", async () => {
                const deal: Deal = {
                    id: "1",
                    title: "Test",
                    value: 5000,
                    customerId: "customer-1",
                    pipelineId: "pipeline-1",
                    stageId: "stage-1",
                    status: "OPEN",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                vi.mocked(dealsApi.list).mockResolvedValue([deal] as never);
                vi.mocked(pipelinesApi.list).mockResolvedValue([] as never);
                const error = new Error("Update failed");
                vi.mocked(dealsApi.update).mockRejectedValue(error);

                const { result } = renderHook(() => useDeals());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await expect(result.current.updateDeal("1", { title: "Updated" })).rejects.toThrow("Update failed");
            });
        });
    });

    describe("deleteDeal", () => {
        describe("正常系", () => {
            test("Dealを削除してリストから除外する", async () => {
                const deal1: Deal = {
                    id: "1",
                    title: "Deal 1",
                    value: 5000,
                    customerId: "customer-1",
                    pipelineId: "pipeline-1",
                    stageId: "stage-1",
                    status: "OPEN",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const deal2: Deal = {
                    id: "2",
                    title: "Deal 2",
                    value: 10000,
                    customerId: "customer-2",
                    pipelineId: "pipeline-1",
                    stageId: "stage-1",
                    status: "OPEN",
                    createdAt: "2024-01-02",
                    updatedAt: "2024-01-02",
                };

                vi.mocked(dealsApi.list).mockResolvedValue([deal1, deal2] as never);
                vi.mocked(pipelinesApi.list).mockResolvedValue([] as never);
                vi.mocked(dealsApi.delete).mockResolvedValue(undefined as never);

                const { result } = renderHook(() => useDeals());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await result.current.deleteDeal("1");

                expect(result.current.deals).toEqual([deal2]);
            });
        });

        describe("異常系", () => {
            test("削除に失敗した場合はエラーをthrowする", async () => {
                const deal: Deal = {
                    id: "1",
                    title: "Test",
                    value: 5000,
                    customerId: "customer-1",
                    pipelineId: "pipeline-1",
                    stageId: "stage-1",
                    status: "OPEN",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                vi.mocked(dealsApi.list).mockResolvedValue([deal] as never);
                vi.mocked(pipelinesApi.list).mockResolvedValue([] as never);
                const error = new Error("Delete failed");
                vi.mocked(dealsApi.delete).mockRejectedValue(error);

                const { result } = renderHook(() => useDeals());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await expect(result.current.deleteDeal("1")).rejects.toThrow("Delete failed");
            });
        });
    });

    describe("moveToStage", () => {
        describe("正常系", () => {
            test("Dealのステージを変更してリスト内の該当項目を置き換える", async () => {
                const deal: Deal = {
                    id: "1",
                    title: "Test Deal",
                    value: 5000,
                    customerId: "customer-1",
                    pipelineId: "pipeline-1",
                    stageId: "stage-1",
                    status: "OPEN",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const movedDeal: Deal = {
                    ...deal,
                    stageId: "stage-2",
                    updatedAt: "2024-01-02",
                };

                vi.mocked(dealsApi.list).mockResolvedValue([deal] as never);
                vi.mocked(pipelinesApi.list).mockResolvedValue([] as never);
                vi.mocked(dealsApi.moveToStage).mockResolvedValue(movedDeal as never);

                const { result } = renderHook(() => useDeals());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await result.current.moveToStage("1", "stage-2");

                expect(result.current.deals).toEqual([movedDeal]);
                expect(dealsApi.moveToStage).toHaveBeenCalledWith("1", "stage-2");
            });
        });

        describe("異常系", () => {
            test("ステージ移動に失敗した場合はエラーをthrowする", async () => {
                const deal: Deal = {
                    id: "1",
                    title: "Test",
                    value: 5000,
                    customerId: "customer-1",
                    pipelineId: "pipeline-1",
                    stageId: "stage-1",
                    status: "OPEN",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                vi.mocked(dealsApi.list).mockResolvedValue([deal] as never);
                vi.mocked(pipelinesApi.list).mockResolvedValue([] as never);
                const error = new Error("Move failed");
                vi.mocked(dealsApi.moveToStage).mockRejectedValue(error);

                const { result } = renderHook(() => useDeals());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await expect(result.current.moveToStage("1", "stage-2")).rejects.toThrow("Move failed");
            });
        });
    });
});
