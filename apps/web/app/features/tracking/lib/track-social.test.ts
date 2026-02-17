import { trackSocial } from "./track-social";

describe("tracking", () => {
    const mockGtag = vi.fn();

    beforeEach(() => {
        (globalThis as unknown as Window).gtag = mockGtag;
    });

    afterEach(() => {
        vi.clearAllMocks();
        delete (globalThis as unknown as Window).gtag;
    });

    test("should call gtag with view_social event", () => {
        trackSocial("github");

        expect(mockGtag).toHaveBeenCalledWith("event", "view_social", {
            provider: "github",
        });
    });

    test("should not call gtag if gtag is not available", () => {
        delete (globalThis as unknown as Window).gtag;

        trackSocial("github");

        expect(mockGtag).not.toHaveBeenCalled();
    });

    test("should call gtag with different providers", () => {
        trackSocial("linkedin");
        expect(mockGtag).toHaveBeenCalledWith("event", "view_social", {
            provider: "linkedin",
        });

        trackSocial("twitter");
        expect(mockGtag).toHaveBeenCalledWith("event", "view_social", {
            provider: "twitter",
        });
    });
});
