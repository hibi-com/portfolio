import { beforeEach, describe, expect, test, vi } from "vitest";

// @portfolio/logパッケージをモック化
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
        // 各テスト前にモックとモジュールをリセット
        vi.clearAllMocks();
        vi.resetModules();
    });

    describe("initLogger", () => {
        describe("正常系", () => {
            test("SENTRY_DSNが設定されている場合、Sentryを初期化する", async () => {
                // Given: Sentry設定が含まれる環境変数
                const { initSentry } = await import("@portfolio/log");
                const env = {
                    SENTRY_DSN: "https://example@sentry.io/project",
                    NODE_ENV: "production",
                    APP_VERSION: "1.0.0",
                };

                // When: initLoggerを実行
                const { initLogger: init } = await import("./logger");
                init(env);

                // Then: initSentryが正しいパラメータで呼ばれる
                expect(initSentry).toHaveBeenCalledWith({
                    dsn: "https://example@sentry.io/project",
                    environment: "production",
                    release: "1.0.0",
                    tracesSampleRate: 0.1,
                });
            });

            test("NODE_ENVがproductionの場合、minLevelがINFOに設定される", async () => {
                // Given: production環境
                const { Logger, LogLevel } = await import("@portfolio/log");
                const env = {
                    SENTRY_DSN: "https://example@sentry.io/project",
                    NODE_ENV: "production",
                };

                // When: initLoggerを実行
                const { initLogger: init } = await import("./logger");
                init(env);

                // Then: LoggerがINFOレベルで初期化される
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
                // Given: 開発環境
                const { Logger, LogLevel } = await import("@portfolio/log");
                const env = {
                    SENTRY_DSN: "https://example@sentry.io/project",
                    NODE_ENV: "development",
                };

                // When: initLoggerを実行
                const { initLogger: init } = await import("./logger");
                init(env);

                // Then: LoggerがDEBUGレベルで初期化される
                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        minLevel: LogLevel.DEBUG,
                        sendToSentry: true,
                    }),
                );
            });

            test("PrometheusClientとCommonMetricsが初期化される", async () => {
                // Given: 環境変数
                const { PrometheusClient, CommonMetrics } = await import("@portfolio/log");
                const env = { NODE_ENV: "production" };

                // When: initLoggerを実行
                const { initLogger: init } = await import("./logger");
                init(env);

                // Then: PrometheusClientとCommonMetricsが初期化される
                expect(PrometheusClient).toHaveBeenCalled();
                const prometheusInstance = vi.mocked(PrometheusClient).mock.results[0]?.value;
                expect(prometheusInstance?.collectDefaultMetrics).toHaveBeenCalled();
                expect(CommonMetrics).toHaveBeenCalledWith(prometheusInstance);
            });
        });

        describe("エッジケース", () => {
            test("SENTRY_DSNが未設定の場合、Sentryを初期化しない", async () => {
                // Given: SENTRY_DSNなしの環境変数
                const { initSentry } = await import("@portfolio/log");
                const env = { NODE_ENV: "development" };

                // When: initLoggerを実行
                const { initLogger: init } = await import("./logger");
                init(env);

                // Then: initSentryが呼ばれない
                expect(initSentry).not.toHaveBeenCalled();
            });

            test("NODE_ENVが未設定の場合、developmentとして扱われる", async () => {
                // Given: NODE_ENVなしの環境変数
                const { Logger, LogLevel } = await import("@portfolio/log");
                const env = {};

                // When: initLoggerを実行
                const { initLogger: init } = await import("./logger");
                init(env);

                // Then: developmentとして初期化される
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
                // Given: production環境でSentry設定あり
                const { initSentry } = await import("@portfolio/log");
                const env = {
                    SENTRY_DSN: "https://example@sentry.io/project",
                    NODE_ENV: "production",
                };

                // When: initLoggerを実行
                const { initLogger: init } = await import("./logger");
                init(env);

                // Then: tracesSampleRateが0.1
                expect(initSentry).toHaveBeenCalledWith(
                    expect.objectContaining({
                        tracesSampleRate: 0.1,
                    }),
                );
            });

            test("NODE_ENVが開発環境の場合、tracesSampleRateが1に設定される", async () => {
                // Given: 開発環境でSentry設定あり
                const { initSentry } = await import("@portfolio/log");
                const env = {
                    SENTRY_DSN: "https://example@sentry.io/project",
                    NODE_ENV: "development",
                };

                // When: initLoggerを実行
                const { initLogger: init } = await import("./logger");
                init(env);

                // Then: tracesSampleRateが1
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
                // Given: initLoggerで初期化済み
                const { Logger } = await import("@portfolio/log");
                const { initLogger: init, getLogger: get } = await import("./logger");
                const env = { NODE_ENV: "production" };
                init(env);
                vi.mocked(Logger).mockClear();

                // When: getLoggerを呼び出す
                const logger = get();

                // Then: 初期化済みのLoggerが返される
                expect(logger).toBeDefined();
                expect(Logger).not.toHaveBeenCalled(); // 再初期化されない
            });

            test("未初期化の場合、デフォルト設定でLoggerを生成する", async () => {
                // Given: initLoggerを呼ばずにgetLoggerを呼び出す
                const { Logger, LogLevel } = await import("@portfolio/log");
                const { getLogger: get } = await import("./logger");

                // When: getLoggerを呼び出す
                const logger = get();

                // Then: デフォルト設定でLoggerが生成される
                expect(logger).toBeDefined();
                expect(Logger).toHaveBeenCalledWith({
                    minLevel: LogLevel.INFO,
                    defaultContext: { service: "api" },
                });
            });
        });

        describe("エッジケース", () => {
            test("複数回呼び出しても同じインスタンスを返す（キャッシュ）", async () => {
                // Given: getLoggerを複数回呼び出す
                const { Logger } = await import("@portfolio/log");
                const { getLogger: get } = await import("./logger");

                // When: 2回呼び出す
                const logger1 = get();
                const logger2 = get();

                // Then: 同じインスタンスが返される
                expect(logger1).toBe(logger2);
                expect(Logger).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("getPrometheus", () => {
        describe("正常系", () => {
            test("initLogger呼び出し後、初期化されたPrometheusClientインスタンスを返す", async () => {
                // Given: initLoggerで初期化済み
                const { PrometheusClient } = await import("@portfolio/log");
                const { initLogger: init, getPrometheus: get } = await import("./logger");
                const env = { NODE_ENV: "production" };
                init(env);
                vi.mocked(PrometheusClient).mockClear();

                // When: getPrometheusを呼び出す
                const prometheus = get();

                // Then: 初期化済みのPrometheusClientが返される
                expect(prometheus).toBeDefined();
                expect(PrometheusClient).not.toHaveBeenCalled(); // 再初期化されない
            });

            test("未初期化の場合、PrometheusClientを生成する", async () => {
                // Given: initLoggerを呼ばずにgetPrometheusを呼び出す
                const { PrometheusClient } = await import("@portfolio/log");
                const { getPrometheus: get } = await import("./logger");

                // When: getPrometheusを呼び出す
                const prometheus = get();

                // Then: PrometheusClientが生成される
                expect(prometheus).toBeDefined();
                expect(PrometheusClient).toHaveBeenCalled();
                expect(prometheus.collectDefaultMetrics).toHaveBeenCalled();
            });
        });

        describe("エッジケース", () => {
            test("複数回呼び出しても同じインスタンスを返す（キャッシュ）", async () => {
                // Given: getPrometheusを複数回呼び出す
                const { PrometheusClient } = await import("@portfolio/log");
                const { getPrometheus: get } = await import("./logger");

                // When: 2回呼び出す
                const prometheus1 = get();
                const prometheus2 = get();

                // Then: 同じインスタンスが返される
                expect(prometheus1).toBe(prometheus2);
                expect(PrometheusClient).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("getMetrics", () => {
        describe("正常系", () => {
            test("initLogger呼び出し後、初期化されたCommonMetricsインスタンスを返す", async () => {
                // Given: initLoggerで初期化済み
                const { CommonMetrics } = await import("@portfolio/log");
                const { initLogger: init, getMetrics: get } = await import("./logger");
                const env = { NODE_ENV: "production" };
                init(env);
                vi.mocked(CommonMetrics).mockClear();

                // When: getMetricsを呼び出す
                const metrics = get();

                // Then: 初期化済みのCommonMetricsが返される
                expect(metrics).toBeDefined();
                expect(CommonMetrics).not.toHaveBeenCalled(); // 再初期化されない
            });

            test("未初期化の場合、CommonMetricsを生成する", async () => {
                // Given: initLoggerを呼ばずにgetMetricsを呼び出す
                const { CommonMetrics, PrometheusClient } = await import("@portfolio/log");
                const { getMetrics: get } = await import("./logger");

                // When: getMetricsを呼び出す
                const metrics = get();

                // Then: CommonMetricsが生成される
                expect(metrics).toBeDefined();
                expect(PrometheusClient).toHaveBeenCalled();
                expect(CommonMetrics).toHaveBeenCalled();
            });
        });

        describe("エッジケース", () => {
            test("複数回呼び出しても同じインスタンスを返す（キャッシュ）", async () => {
                // Given: getMetricsを複数回呼び出す
                const { CommonMetrics } = await import("@portfolio/log");
                const { getMetrics: get } = await import("./logger");

                // When: 2回呼び出す
                const metrics1 = get();
                const metrics2 = get();

                // Then: 同じインスタンスが返される
                expect(metrics1).toBe(metrics2);
                expect(CommonMetrics).toHaveBeenCalledTimes(1);
            });

            test("getPrometheusが内部的に呼ばれる", async () => {
                // Given: getMetricsを呼び出す
                const { PrometheusClient, CommonMetrics } = await import("@portfolio/log");
                const { getMetrics: get } = await import("./logger");

                // When: getMetricsを呼び出す
                const metrics = get();

                // Then: PrometheusClientが先に初期化される
                expect(PrometheusClient).toHaveBeenCalled();
                const prometheusInstance = vi.mocked(PrometheusClient).mock.results[0]?.value;
                expect(CommonMetrics).toHaveBeenCalledWith(prometheusInstance);
                expect(metrics).toBeDefined();
            });
        });
    });
});
