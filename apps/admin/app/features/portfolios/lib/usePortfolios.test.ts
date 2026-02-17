import { portfolios as portfoliosApi } from "@portfolio/api";
import { renderHook, waitFor } from "@testing-library/react";
import { usePortfolios } from "./usePortfolios";

vi.mock("@portfolio/api", () => ({
    portfolios: {
        list: vi.fn(),
    },
}));

describe("usePortfolios", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should initialize with empty portfolios and loading true", () => {
        vi.mocked(portfoliosApi.list).mockResolvedValue({ data: [] } as never);

        const { result } = renderHook(() => usePortfolios());

        expect(result.current.portfolios).toEqual([]);
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();
    });

    test("should fetch and update portfolios", async () => {
        const mockPortfolios = [
            {
                id: "1",
                title: "Test Portfolio",
                slug: "test-portfolio",
                company: "Test Company",
                date: "2024-01-01",
                current: false,
            },
        ];

        vi.mocked(portfoliosApi.list).mockResolvedValue({ data: mockPortfolios } as never);

        const { result } = renderHook(() => usePortfolios());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.portfolios).toEqual(mockPortfolios);
        expect(portfoliosApi.list).toHaveBeenCalled();
    });

    test("should handle empty data", async () => {
        vi.mocked(portfoliosApi.list).mockResolvedValue({ data: null } as never);

        const { result } = renderHook(() => usePortfolios());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.portfolios).toEqual([]);
    });

    test("should handle errors", async () => {
        const error = new Error("Failed to fetch");
        vi.mocked(portfoliosApi.list).mockRejectedValue(error);

        const { result } = renderHook(() => usePortfolios());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toContain("Failed to fetch");
        expect(result.current.portfolios).toEqual([]);
    });
});
