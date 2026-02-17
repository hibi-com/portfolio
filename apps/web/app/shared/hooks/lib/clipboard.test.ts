import { copyTextToClipboard } from "./clipboard";

const mockLogger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
};

vi.mock("~/lib/logger", () => ({
    getLogger: () => mockLogger,
}));

describe("clipboard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = "";
    });

    afterEach(() => {
        vi.restoreAllMocks();
        document.body.innerHTML = "";
    });

    describe("copyTextToClipboard", () => {
        test("should use navigator.clipboard when available", async () => {
            const text = "test clipboard text";
            const writeTextMock = vi.fn().mockResolvedValue(undefined);

            const originalClipboard = navigator.clipboard;
            Object.defineProperty(navigator, "clipboard", {
                value: { writeText: writeTextMock },
                configurable: true,
            });

            try {
                copyTextToClipboard(text);
                await new Promise((resolve) => setTimeout(resolve, 10));

                expect(writeTextMock).toHaveBeenCalledWith(text);
                expect(mockLogger.debug).toHaveBeenCalledWith("Copied to clipboard", { text });
            } finally {
                Object.defineProperty(navigator, "clipboard", {
                    value: originalClipboard,
                    configurable: true,
                });
            }
        });

        test("should handle navigator.clipboard errors", async () => {
            const error = new Error("Clipboard write failed");
            const writeTextMock = vi.fn().mockRejectedValue(error);

            const originalClipboard = navigator.clipboard;
            Object.defineProperty(navigator, "clipboard", {
                value: { writeText: writeTextMock },
                configurable: true,
            });

            try {
                copyTextToClipboard("test");
                await new Promise((resolve) => setTimeout(resolve, 10));

                expect(mockLogger.error).toHaveBeenCalled();
            } finally {
                Object.defineProperty(navigator, "clipboard", {
                    value: originalClipboard,
                    configurable: true,
                });
            }
        });

        test("should log warning when navigator.clipboard is not available", () => {
            const text = "test fallback";

            const originalClipboard = navigator.clipboard;
            Object.defineProperty(navigator, "clipboard", {
                value: undefined,
                configurable: true,
            });

            try {
                copyTextToClipboard(text);

                expect(mockLogger.warn).toHaveBeenCalled();
            } finally {
                Object.defineProperty(navigator, "clipboard", {
                    value: originalClipboard,
                    configurable: true,
                });
            }
        });
    });
});
