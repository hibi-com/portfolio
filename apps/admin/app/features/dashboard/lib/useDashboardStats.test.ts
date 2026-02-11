import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { portfolios as portfoliosApi, posts as postsApi } from "@portfolio/api";
import { useDashboardStats } from "./useDashboardStats";

vi.mock("@portfolio/api", () => ({
    posts: {
        list: vi.fn(),
    },
    portfolios: {
        list: vi.fn(),
    },
}));

describe("useDashboardStats", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should initialize with default stats", () => {
        vi.mocked(postsApi.list).mockResolvedValue({ data: [] } as never);
        vi.mocked(portfoliosApi.list).mockResolvedValue({ data: [] } as never);

        const { result } = renderHook(() => useDashboardStats());

        expect(result.current.stats).toEqual({
            posts: 0,
            portfolios: 0,
            totalViews: 0,
            users: 0,
        });
        expect(result.current.loading).toBe(true);
    });

    test("should fetch and update stats", async () => {
        vi.mocked(postsApi.list).mockResolvedValue({
            data: [
                { id: "1", title: "Test Post" },
                { id: "2", title: "Test Post 2" },
            ],
        } as never);
        vi.mocked(portfoliosApi.list).mockResolvedValue({
            data: [{ id: "1", title: "Test Portfolio" }],
        } as never);

        const { result } = renderHook(() => useDashboardStats());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.stats).toEqual({
            posts: 2,
            portfolios: 1,
            totalViews: 0,
            users: 0,
        });
        expect(postsApi.list).toHaveBeenCalled();
        expect(portfoliosApi.list).toHaveBeenCalled();
    });

    test("should handle empty data", async () => {
        vi.mocked(postsApi.list).mockResolvedValue({ data: null } as never);
        vi.mocked(portfoliosApi.list).mockResolvedValue({ data: null } as never);

        const { result } = renderHook(() => useDashboardStats());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.stats).toEqual({
            posts: 0,
            portfolios: 0,
            totalViews: 0,
            users: 0,
        });
    });

    test("should handle errors", async () => {
        const error = new Error("Failed to fetch");
        vi.mocked(postsApi.list).mockRejectedValue(error);
        vi.mocked(portfoliosApi.list).mockResolvedValue({ data: [] } as never);

        const { result } = renderHook(() => useDashboardStats());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toContain("Failed to fetch");
    });
});
