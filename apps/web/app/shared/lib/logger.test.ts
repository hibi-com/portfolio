import type { LoggerConfig } from "@portfolio/log";

vi.mock("@portfolio/log", () => ({
    initSentry: vi.fn(),
    Logger: vi.fn().mockImplementation((config: LoggerConfig) => ({
        config,
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    })),
    LogLevel: {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
    },
}));

describe("logger", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    describe("initLogger", () => {
        describe("正常系", () => {
            test("SENTRY_DSNが設定されている場合、Sentryを初期化する", async () => {
                const { initSentry } = await import("@portfolio/log");
                const { initLogger } = await import("./logger");
                const env = {
                    SENTRY_DSN: "https://test@sentry.io/123",
                    NODE_ENV: "production",
                    APP_VERSION: "1.0.0",
                };

                initLogger(env);

                expect(initSentry).toHaveBeenCalledWith({
                    dsn: "https://test@sentry.io/123",
                    environment: "production",
                    release: "1.0.0",
                    tracesSampleRate: 0.1,
                });
            });

            test("開発環境ではtracesSampleRateが1になる", async () => {
                const { initSentry } = await import("@portfolio/log");
                const { initLogger } = await import("./logger");
                const env = {
                    SENTRY_DSN: "https://test@sentry.io/123",
                    NODE_ENV: "development",
                };

                initLogger(env);

                expect(initSentry).toHaveBeenCalledWith(
                    expect.objectContaining({
                        tracesSampleRate: 1,
                    }),
                );
            });

            test("SENTRY_DSNがない場合、Sentryを初期化しない", async () => {
                const { initSentry } = await import("@portfolio/log");
                const { initLogger } = await import("./logger");
                const env = {
                    NODE_ENV: "development",
                };

                initLogger(env);

                expect(initSentry).not.toHaveBeenCalled();
            });

            test("Loggerを正しい設定で初期化する", async () => {
                const { Logger, LogLevel } = await import("@portfolio/log");
                const { initLogger } = await import("./logger");
                const env = {
                    SENTRY_DSN: "https://test@sentry.io/123",
                    NODE_ENV: "production",
                };

                initLogger(env);

                expect(Logger).toHaveBeenCalledWith({
                    minLevel: LogLevel.INFO,
                    sendToSentry: true,
                    sentryMinLevel: LogLevel.ERROR,
                    defaultContext: {
                        service: "web",
                        environment: "production",
                    },
                });
            });

            test("開発環境ではminLevelがDEBUGになる", async () => {
                const { Logger, LogLevel } = await import("@portfolio/log");
                const { initLogger } = await import("./logger");
                const env = {
                    NODE_ENV: "development",
                };

                initLogger(env);

                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        minLevel: LogLevel.DEBUG,
                    }),
                );
            });
        });

        describe("エッジケース", () => {
            test("NODE_ENVが未設定の場合、developmentがデフォルトになる", async () => {
                const { Logger } = await import("@portfolio/log");
                const { initLogger } = await import("./logger");
                const env = {};

                initLogger(env);

                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        defaultContext: expect.objectContaining({
                            environment: "development",
                        }),
                    }),
                );
            });
        });
    });

    describe("getLogger", () => {
        describe("正常系", () => {
            test("initLoggerで初期化済みの場合、そのロガーを返す", async () => {
                const { initLogger, getLogger } = await import("./logger");
                initLogger({ NODE_ENV: "production" });

                const logger1 = getLogger();
                const logger2 = getLogger();

                expect(logger1).toBe(logger2);
            });

            test("未初期化の場合、デフォルトロガーを作成する", async () => {
                const { Logger } = await import("@portfolio/log");
                const { getLogger } = await import("./logger");

                const logger = getLogger();

                expect(logger).toBeDefined();
                expect(Logger).toHaveBeenCalled();
            });
        });
    });
});
