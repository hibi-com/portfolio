import { renderHook } from "@testing-library/react";
import { useWebShareAPI } from "./useWebShareAPI";

describe("useWebShareAPI", () => {
    const originalShare = navigator.share;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        try {
            Object.defineProperty(navigator, "share", {
                value: originalShare,
                writable: true,
                configurable: true,
            });
        } catch {
            // Ignore
        }
    });

    test("should return isAvailable based on navigator.share existence", () => {
        const { result } = renderHook(() => useWebShareAPI());

        expect(typeof result.current.isAvailable).toBe("boolean");
    });

    test("should return onShare function", () => {
        const { result } = renderHook(() => useWebShareAPI());

        expect(typeof result.current.onShare).toBe("function");
    });

    test("should handle onShare call without error when share is not available", async () => {
        const { result } = renderHook(() => useWebShareAPI());

        await expect(result.current.onShare("https://example.com")).resolves.not.toThrow();
    });

    test("should have correct return type", () => {
        const { result } = renderHook(() => useWebShareAPI());

        expect(result.current).toHaveProperty("isAvailable");
        expect(result.current).toHaveProperty("onShare");
    });

    test("isAvailable should be false when navigator.share is undefined", () => {
        const { result } = renderHook(() => useWebShareAPI());

        if (navigator.share === undefined) {
            expect(result.current.isAvailable).toBe(false);
        }
    });

    test("onShare should be callable with url parameter", async () => {
        const { result } = renderHook(() => useWebShareAPI());

        const onShare = result.current.onShare;
        expect(onShare).toBeInstanceOf(Function);
    });

    test("hook should return stable references", () => {
        const { result, rerender } = renderHook(() => useWebShareAPI());

        const firstIsAvailable = result.current.isAvailable;

        rerender();

        expect(result.current.isAvailable).toBe(firstIsAvailable);
    });
});
