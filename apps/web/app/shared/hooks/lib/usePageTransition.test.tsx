import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { usePageTransition } from "./usePageTransition";

interface DocumentTransition {
    start(callback: () => void | Promise<void>): Promise<void>;
}

interface DocumentWithTransition extends Document {
    createDocumentTransition?(): DocumentTransition;
}

const mockNavigate = vi.fn();

vi.mock("@remix-run/react", () => ({
    useNavigate: () => mockNavigate,
}));

const Wrapper = ({ children }: { children: ReactNode }) => {
    return <MemoryRouter>{children}</MemoryRouter>;
};

describe("usePageTransition", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.fetch = vi.fn().mockResolvedValue(new Response());
        globalThis.window = globalThis as unknown as Window & typeof globalThis;
        const doc = document as DocumentWithTransition;
        doc.createDocumentTransition = undefined;
    });

    test("should return transition function", () => {
        const { result } = renderHook(() => usePageTransition(), {
            wrapper: Wrapper,
        });

        expect(result.current.transition).toBeDefined();
        expect(typeof result.current.transition).toBe("function");
    });

    test("should call fetch with correct URL", async () => {
        const { result } = renderHook(() => usePageTransition(), {
            wrapper: Wrapper,
        });

        await result.current.transition("/test");

        expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining("/test"));
    });

    test("should navigate when document transition is not supported", async () => {
        const doc = document as DocumentWithTransition;
        doc.createDocumentTransition = undefined;

        const { result } = renderHook(() => usePageTransition(), {
            wrapper: Wrapper,
        });

        await result.current.transition("/test");

        expect(mockNavigate).toHaveBeenCalledWith("/test");
    });

    test("should use document transition when supported", async () => {
        const mockStart = vi.fn().mockResolvedValue(undefined);
        const doc = document as DocumentWithTransition;
        doc.createDocumentTransition = vi.fn(() => ({
            start: mockStart,
        }));

        const { result } = renderHook(() => usePageTransition(), {
            wrapper: Wrapper,
        });

        await result.current.transition("/test");

        expect(mockStart).toHaveBeenCalled();
    });
});
