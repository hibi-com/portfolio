import {
    BASE_URL,
    GOOGLE_ANALYTICS,
    GOOGLE_ANALYTICS_ENABLED,
    GOOGLE_TAG_MANAGER,
    GOOGLE_TAG_MANAGER_ENABLED,
    SENTRY_DSN,
    SENTRY_ENVIRONMENT,
    SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE,
    SENTRY_REPLAY_SAMPLE_RATE,
    SENTRY_TRACES_SAMPLE_RATE,
    XSTATE_INSPECTOR_ENABLED,
} from "./settings";

describe("settings", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv };
    });

    test("should export BASE_URL with fallback", () => {
        expect(BASE_URL).toBeTruthy();
        expect(typeof BASE_URL).toBe("string");
    });

    test("should export GOOGLE_ANALYTICS with fallback", () => {
        expect(GOOGLE_ANALYTICS).toBeTruthy();
        expect(typeof GOOGLE_ANALYTICS).toBe("string");
    });

    test("should export GOOGLE_TAG_MANAGER with fallback", () => {
        expect(GOOGLE_TAG_MANAGER).toBeTruthy();
        expect(typeof GOOGLE_TAG_MANAGER).toBe("string");
    });

    test("should export GOOGLE_ANALYTICS_ENABLED as boolean", () => {
        expect(typeof GOOGLE_ANALYTICS_ENABLED).toBe("boolean");
    });

    test("should export GOOGLE_TAG_MANAGER_ENABLED as boolean", () => {
        expect(typeof GOOGLE_TAG_MANAGER_ENABLED).toBe("boolean");
    });

    test("should export XSTATE_INSPECTOR_ENABLED as boolean", () => {
        expect(typeof XSTATE_INSPECTOR_ENABLED).toBe("boolean");
    });

    test("should export SENTRY_DSN with fallback", () => {
        expect(SENTRY_DSN).toBeTruthy();
        expect(typeof SENTRY_DSN).toBe("string");
    });

    test("should export SENTRY_ENVIRONMENT with default value", () => {
        expect(SENTRY_ENVIRONMENT).toBeTruthy();
        expect(typeof SENTRY_ENVIRONMENT).toBe("string");
    });

    test("should export SENTRY_TRACES_SAMPLE_RATE as number", () => {
        expect(typeof SENTRY_TRACES_SAMPLE_RATE).toBe("number");
        expect(SENTRY_TRACES_SAMPLE_RATE).toBeGreaterThanOrEqual(0);
        expect(SENTRY_TRACES_SAMPLE_RATE).toBeLessThanOrEqual(1);
    });

    test("should export SENTRY_REPLAY_SAMPLE_RATE as number", () => {
        expect(typeof SENTRY_REPLAY_SAMPLE_RATE).toBe("number");
        expect(SENTRY_REPLAY_SAMPLE_RATE).toBeGreaterThanOrEqual(0);
        expect(SENTRY_REPLAY_SAMPLE_RATE).toBeLessThanOrEqual(1);
    });

    test("should export SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE as number", () => {
        expect(typeof SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE).toBe("number");
        expect(SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE).toBeGreaterThanOrEqual(0);
        expect(SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE).toBeLessThanOrEqual(1);
    });
});
