import { vi } from "vitest";

interface ClipboardAPI {
    writeText: (text: string) => Promise<void>;
    readText: () => Promise<string>;
}

let clipboardStore = "";

export const getClipboardStore = (): string => {
    return clipboardStore;
};

export const resetClipboardStore = (): void => {
    clipboardStore = "";
};

try {
    const navigatorWithClipboard = navigator as Navigator & {
        clipboard?: ClipboardAPI;
    };
    if ("clipboard" in navigatorWithClipboard && navigatorWithClipboard.clipboard) {
        vi.spyOn(navigatorWithClipboard.clipboard, "writeText").mockImplementation(async (text: string) => {
            clipboardStore = text;
        });
        vi.spyOn(navigatorWithClipboard.clipboard, "readText").mockImplementation(async () => {
            return clipboardStore;
        });
    } else {
        Object.defineProperty(navigator, "clipboard", {
            configurable: true,
            writable: true,
            value: {
                writeText: vi.fn().mockImplementation(async (text: string) => {
                    clipboardStore = text;
                }),
                readText: vi.fn().mockImplementation(async () => {
                    return clipboardStore;
                }),
            },
        });
    }
} catch (error) {
    console.warn(
        "[vitest-config] Failed to setup clipboard mock:",
        error instanceof Error ? error.message : String(error),
    );
}

export class IntersectionObserverMock implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "0px";
    readonly thresholds: ReadonlyArray<number> = [];
    private readonly observedElements = new Set<Element>();

    constructor(
        public callback: IntersectionObserverCallback,
        public options?: IntersectionObserverInit,
    ) {}

    observe(target: Element): void {
        this.observedElements.add(target);
    }

    unobserve(target: Element): void {
        this.observedElements.delete(target);
    }

    disconnect(): void {
        this.observedElements.clear();
    }

    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }

    triggerIntersect(entries: Partial<IntersectionObserverEntry>[]): void {
        const fullEntries = entries.map((entry) => ({
            boundingClientRect: { ...emptyRect, ...entry.boundingClientRect },
            intersectionRatio: entry.intersectionRatio ?? 1,
            intersectionRect: { ...emptyRect, ...entry.intersectionRect },
            isIntersecting: entry.isIntersecting ?? true,
            rootBounds: null,
            target: entry.target ?? document.createElement("div"),
            time: Date.now(),
        })) as IntersectionObserverEntry[];

        this.callback(fullEntries, this);
    }
}

globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

export class ResizeObserverMock implements ResizeObserver {
    private readonly observedElements = new Set<Element>();

    constructor(public callback: ResizeObserverCallback) {}

    observe(target: Element, _options?: ResizeObserverOptions): void {
        this.observedElements.add(target);
    }

    unobserve(target: Element): void {
        this.observedElements.delete(target);
    }

    disconnect(): void {
        this.observedElements.clear();
    }

    triggerResize(entries: Partial<ResizeObserverEntry>[]): void {
        const fullEntries = entries.map((e) => ({
            ...e,
            contentRect: e.contentRect ?? emptyRect,
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: [],
        })) as ResizeObserverEntry[];

        this.callback(fullEntries, this);
    }
}

globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

Object.defineProperty(globalThis, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

const emptyRect = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: vi.fn(),
};

Element.prototype.getBoundingClientRect = vi.fn(() => emptyRect);
Element.prototype.scrollIntoView = vi.fn();

Object.defineProperty(globalThis, "scrollTo", {
    writable: true,
    value: vi.fn(),
});

globalThis.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 0) as unknown as number);
globalThis.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

Object.defineProperty(navigator, "share", {
    writable: true,
    value: vi.fn().mockResolvedValue(undefined),
});
