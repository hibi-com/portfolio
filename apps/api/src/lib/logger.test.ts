vi.mock("@portfolio/log", () => {
    const MockLogger = vi.fn().mockImplementation((config) => ({
        _config: config,
    }));

    const MockPrometheusClient = vi.fn().mockImplementation(() => ({
        collectDefaultMetrics: vi.fn(),
    }));

    const MockCommonMetrics = vi.fn().mockImplementation((client) => ({
        _client: client,
    }));

    const mockInitSentry = vi.fn();

    return {
        Logger: MockLogger,
        PrometheusClient: MockPrometheusClient,
        CommonMetrics: MockCommonMetrics,
        initSentry: mockInitSentry,
        LogLevel: {
            DEBUG: "DEBUG",
            INFO: "INFO",
            WARN: "WARN",
            ERROR: "ERROR",
        },
    };
});

describe("logger", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    describe("initLogger", () => {
        describe("正常系", () => {
            test("SENTRY_DSNが設定されている場合、Sentryを初期化する", async () => {
                const { initSentry } = await import("@portfolio/log");
                const env = {
                    SENTRY_DSN: "https://example@sentry.io/project",
                    NODE_ENV: "production",
                    APP_VERSION: "1.0.0",
                };

                const { initLogger: init } = await import("./logger");
                init(env);

                expect(initSentry).toHaveBeenCalledWith({
                    dsn: "https://example@sentry.io/project",
                    environment: "production",
                    release: "1.0.0",
                    tracesSampleRate: 0.1,
                });
            });

            test("NODE_ENVがproductionの場合、minLevelがINFOに設定される", async () => {
                const { Logger, LogLevel } = await import("@portfolio/log");
                const env = {
                    SENTRY_DSN: "https://example@sentry.io/project",
                    NODE_ENV: "production",
                };

                const { initLogger: init } = await import("./logger");
                init(env);

                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        minLevel: LogLevel.INFO,
                        sendToSentry: true,
                        sentryMinLevel: LogLevel.ERROR,
                        defaultContext: {
                            service: "api",
                            environment: "production",
                        },
                    }),
                );
            });

            test("NODE_ENVが開発環境の場合、minLevelがDEBUGに設定される", async () => {
                const { Logger, LogLevel } = await import("@portfolio/log");
                const env = {
                    SENTRY_DSN: "https://example@sentry.io/project",
                    NODE_ENV: "development",
                };

                const { initLogger: init } = await import("./logger");
                init(env);

                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        minLevel: LogLevel.DEBUG,
                        sendToSentry: true,
                    }),
                );
            });

            test("PrometheusClientとCommonMetricsが初期化される", async () => {
                const { PrometheusClient, CommonMetrics } = await import("@portfolio/log");
                const env = { NODE_ENV: "production" };

                const { initLogger: init } = await import("./logger");
                init(env);

                expect(PrometheusClient).toHaveBeenCalled();
                const prometheusInstance = vi.mocked(PrometheusClient).mock.results[0]?.value;
                expect(prometheusInstance?.collectDefaultMetrics).toHaveBeenCalled();
                expect(CommonMetrics).toHaveBeenCalledWith(prometheusInstance);
            });
        });

        describe("エッジケース", () => {
            test("SENTRY_DSNが未設定の場合、Sentryを初期化しない", async () => {
                const { initSentry } = await import("@portfolio/log");
                const env = { NODE_ENV: "development" };

                const { initLogger: init } = await import("./logger");
                init(env);

                expect(initSentry).not.toHaveBeenCalled();
            });

            test("NODE_ENVが未設定の場合、developmentとして扱われる", async () => {
                const { Logger, LogLevel } = await import("@portfolio/log");
                const env = {};

                const { initLogger: init } = await import("./logger");
                init(env);

                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        minLevel: LogLevel.DEBUG,
                        defaultContext: expect.objectContaining({
                            environment: "development",
                        }),
                    }),
                );
            });

            test("NODE_ENVがproductionの場合、tracesSampleRateが0.1に設定される", async () => {
                const { initSentry } = await import("@portfolio/log");
                const env = {
                    SENTRY_DSN: "https://example@sentry.io/project",
                    NODE_ENV: "production",
                };

                const { initLogger: init } = await import("./logger");
                init(env);

                expect(initSentry).toHaveBeenCalledWith(
                    expect.objectContaining({
                        tracesSampleRate: 0.1,
                    }),
                );
            });

            test("NODE_ENVが開発環境の場合、tracesSampleRateが1に設定される", async () => {
                const { initSentry } = await import("@portfolio/log");
                const env = {
                    SENTRY_DSN: "https://example@sentry.io/project",
                    NODE_ENV: "development",
                };

                const { initLogger: init } = await import("./logger");
                init(env);

                expect(initSentry).toHaveBeenCalledWith(
                    expect.objectContaining({
                        tracesSampleRate: 1,
                    }),
                );
            });
        });
    });

    describe("getLogger", () => {
        describe("正常系", () => {
            test("initLogger呼び出し後、初期化されたLoggerインスタンスを返す", async () => {
                const { Logger } = await import("@portfolio/log");
                const { initLogger: init, getLogger: get } = await import("./logger");
                const env = { NODE_ENV: "production" };
                init(env);
                vi.mocked(Logger).mockClear();

                const logger = get();

                expect(logger).toBeDefined();
                expect(Logger).not.toHaveBeenCalled();
            });

            test("未初期化の場合、デフォルト設定でLoggerを生成する", async () => {
                const { Logger, LogLevel } = await import("@portfolio/log");
                const { getLogger: get } = await import("./logger");

                const logger = get();

                expect(logger).toBeDefined();
                expect(Logger).toHaveBeenCalledWith({
                    minLevel: LogLevel.INFO,
                    defaultContext: { service: "api" },
                });
            });
        });

        describe("エッジケース", () => {
            test("複数回呼び出しても同じインスタンスを返す（キャッシュ）", async () => {
                const { Logger } = await import("@portfolio/log");
                const { getLogger: get } = await import("./logger");

                const logger1 = get();
                const logger2 = get();

                expect(logger1).toBe(logger2);
                expect(Logger).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("getPrometheus", () => {
        describe("正常系", () => {
            test("initLogger呼び出し後、初期化されたPrometheusClientインスタンスを返す", async () => {
                const { PrometheusClient } = await import("@portfolio/log");
                const { initLogger: init, getPrometheus: get } = await import("./logger");
                const env = { NODE_ENV: "production" };
                init(env);
                vi.mocked(PrometheusClient).mockClear();

                const prometheus = get();

                expect(prometheus).toBeDefined();
                expect(PrometheusClient).not.toHaveBeenCalled();
            });

            test("未初期化の場合、PrometheusClientを生成する", async () => {
                const { PrometheusClient } = await import("@portfolio/log");
                const { getPrometheus: get } = await import("./logger");

                const prometheus = get();

                expect(prometheus).toBeDefined();
                expect(PrometheusClient).toHaveBeenCalled();
                expect(prometheus.collectDefaultMetrics).toHaveBeenCalled();
            });
        });

        describe("エッジケース", () => {
            test("複数回呼び出しても同じインスタンスを返す（キャッシュ）", async () => {
                const { PrometheusClient } = await import("@portfolio/log");
                const { getPrometheus: get } = await import("./logger");

                const prometheus1 = get();
                const prometheus2 = get();

                expect(prometheus1).toBe(prometheus2);
                expect(PrometheusClient).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("getMetrics", () => {
        describe("正常系", () => {
            test("initLogger呼び出し後、初期化されたCommonMetricsインスタンスを返す", async () => {
                const { CommonMetrics } = await import("@portfolio/log");
                const { initLogger: init, getMetrics: get } = await import("./logger");
                const env = { NODE_ENV: "production" };
                init(env);
                vi.mocked(CommonMetrics).mockClear();

                const metrics = get();

                expect(metrics).toBeDefined();
                expect(CommonMetrics).not.toHaveBeenCalled();
            });

            test("未初期化の場合、CommonMetricsを生成する", async () => {
                const { CommonMetrics, PrometheusClient } = await import("@portfolio/log");
                const { getMetrics: get } = await import("./logger");

                const metrics = get();

                expect(metrics).toBeDefined();
                expect(PrometheusClient).toHaveBeenCalled();
                expect(CommonMetrics).toHaveBeenCalled();
            });
        });

        describe("エッジケース", () => {
            test("複数回呼び出しても同じインスタンスを返す（キャッシュ）", async () => {
                const { CommonMetrics } = await import("@portfolio/log");
                const { getMetrics: get } = await import("./logger");

                const metrics1 = get();
                const metrics2 = get();

                expect(metrics1).toBe(metrics2);
                expect(CommonMetrics).toHaveBeenCalledTimes(1);
            });

            test("getPrometheusが内部的に呼ばれる", async () => {
                const { PrometheusClient, CommonMetrics } = await import("@portfolio/log");
                const { getMetrics: get } = await import("./logger");

                const metrics = get();

                expect(PrometheusClient).toHaveBeenCalled();
                const prometheusInstance = vi.mocked(PrometheusClient).mock.results[0]?.value;
                expect(CommonMetrics).toHaveBeenCalledWith(prometheusInstance);
                expect(metrics).toBeDefined();
            });
        });
    });
});
