import { act, renderHook } from "@testing-library/react";
import { useClipboard } from "./useClipboard";

vi.mock("~/shared/lib/clipboard", () => ({
    copyTextToClipboard: vi.fn(),
}));

describe("useClipboard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should return onCopy function and value", () => {
        const { result } = renderHook(() => useClipboard());

        expect(result.current.onCopy).toBeDefined();
        expect(result.current.value).toBeUndefined();
    });

    test("should update value when onCopy is called", () => {
        const { result } = renderHook(() => useClipboard());

        act(() => {
            result.current.onCopy("test value");
        });

        expect(result.current.value).toBe("test value");
    });
});
