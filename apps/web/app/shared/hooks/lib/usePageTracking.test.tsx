import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { usePageTracking } from "./usePageTracking";

let mockPathname = "/";

vi.mock("@remix-run/react", async () => {
    const actual = await vi.importActual("@remix-run/react");
    return {
        ...actual,
        useLocation: () => ({
            pathname: mockPathname,
            hash: "",
            key: "test",
            search: "",
            state: null,
        }),
    };
});

describe("usePageTracking", () => {
    const mockGtag = vi.fn();
    const originalGtag = (globalThis as unknown as Window).gtag;

    beforeEach(() => {
        vi.clearAllMocks();
        (globalThis as unknown as Window).gtag = mockGtag;
    });

    afterEach(() => {
        (globalThis as unknown as Window).gtag = originalGtag;
    });

    test("should call gtag with page_view event when gtag is available", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
        );

        renderHook(() => usePageTracking(), { wrapper });

        expect(mockGtag).toHaveBeenCalledWith("event", "page_view", {
            page_location: expect.stringContaining("/"),
        });
    });

    test("should call gtag with correct page_location", () => {
        mockPathname = "/blog";

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <MemoryRouter initialEntries={["/blog"]}>{children}</MemoryRouter>
        );

        renderHook(() => usePageTracking(), { wrapper });

        expect(mockGtag).toHaveBeenCalledWith("event", "page_view", {
            page_location: expect.stringContaining("/blog"),
        });

        mockPathname = "/";
    });

    test("should not call gtag when gtag is not available", () => {
        (globalThis as unknown as Window).gtag = undefined;

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
        );

        renderHook(() => usePageTracking(), { wrapper });

        expect(mockGtag).not.toHaveBeenCalled();
    });

    test("should call gtag again when pathname changes", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
        );

        const { rerender } = renderHook(() => usePageTracking(), { wrapper });

        expect(mockGtag).toHaveBeenCalledTimes(1);

        wrapper({ children: <div /> });
        rerender();

        expect(mockGtag).toHaveBeenCalled();
    });
});
