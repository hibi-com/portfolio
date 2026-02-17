import { initSentry, Logger, LogLevel } from "@portfolio/log";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getLogger, initLogger, resetLoggerForTesting } from "./logger";

vi.mock("@portfolio/log", () => ({
    Logger: vi.fn(),
    LogLevel: {
        DEBUG: "DEBUG",
        INFO: "INFO",
        ERROR: "ERROR",
    },
    initSentry: vi.fn(),
}));

describe("logger", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetLoggerForTesting();
    });

    describe("initLogger", () => {
        describe("正常系", () => {
            test("SENTRY_DSNが指定されている場合はSentryを初期化する", () => {
                const env = {
                    SENTRY_DSN: "https://example.com/sentry",
                    NODE_ENV: "production",
                    APP_VERSION: "1.0.0",
                };

                initLogger(env);

                expect(initSentry).toHaveBeenCalledWith({
                    dsn: "https://example.com/sentry",
                    environment: "production",
                    release: "1.0.0",
                    tracesSampleRate: 0.1,
                });
            });

            test("SENTRY_DSNが指定されていない場合はSentryを初期化しない", () => {
                const env = {
                    NODE_ENV: "development",
                };

                initLogger(env);

                expect(initSentry).not.toHaveBeenCalled();
            });

            test("production環境ではminLevelをINFOに設定する", () => {
                const env = {
                    SENTRY_DSN: "https://example.com/sentry",
                    NODE_ENV: "production",
                };

                initLogger(env);

                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        minLevel: LogLevel.INFO,
                    }),
                );
            });

            test("development環境ではminLevelをDEBUGに設定する", () => {
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

            test("SENTRY_DSNが指定されている場合はsendToSentryをtrueに設定する", () => {
                const env = {
                    SENTRY_DSN: "https://example.com/sentry",
                    NODE_ENV: "production",
                };

                initLogger(env);

                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        sendToSentry: true,
                        sentryMinLevel: LogLevel.ERROR,
                    }),
                );
            });

            test("SENTRY_DSNが指定されていない場合はsendToSentryをfalseに設定する", () => {
                const env = {
                    NODE_ENV: "development",
                };

                initLogger(env);

                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        sendToSentry: false,
                    }),
                );
            });

            test("defaultContextにserviceとenvironmentを設定する", () => {
                const env = {
                    NODE_ENV: "staging",
                };

                initLogger(env);

                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        defaultContext: {
                            service: "admin",
                            environment: "staging",
                        },
                    }),
                );
            });

            test("development環境以外でもtracesSampleRateは1になる", () => {
                const env = {
                    SENTRY_DSN: "https://example.com/sentry",
                    NODE_ENV: "staging",
                };

                initLogger(env);

                expect(initSentry).toHaveBeenCalledWith(
                    expect.objectContaining({
                        tracesSampleRate: 1,
                    }),
                );
            });
        });

        describe("境界値", () => {
            test("NODE_ENVが未設定の場合はdevelopmentをデフォルト値とする", () => {
                const env = {};

                initLogger(env);

                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        minLevel: LogLevel.DEBUG,
                        defaultContext: {
                            service: "admin",
                            environment: "development",
                        },
                    }),
                );
            });

            test("NODE_ENVが未設定でSENTRY_DSNがある場合もSentryを初期化する", () => {
                const env = {
                    SENTRY_DSN: "https://example.com/sentry",
                };

                initLogger(env);

                expect(initSentry).toHaveBeenCalledWith(
                    expect.objectContaining({
                        environment: "development",
                    }),
                );
            });

            test("APP_VERSIONが未設定の場合はundefinedになる", () => {
                const env = {
                    SENTRY_DSN: "https://example.com/sentry",
                    NODE_ENV: "production",
                };

                initLogger(env);

                expect(initSentry).toHaveBeenCalledWith(
                    expect.objectContaining({
                        release: undefined,
                    }),
                );
            });

            test("空文字のSENTRY_DSNはfalsy扱いでSentryを初期化しない", () => {
                const env = {
                    SENTRY_DSN: "",
                    NODE_ENV: "production",
                };

                initLogger(env);

                expect(initSentry).not.toHaveBeenCalled();
                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        sendToSentry: false,
                    }),
                );
            });
        });
    });

    describe("getLogger", () => {
        describe("正常系", () => {
            test("loggerが未初期化の場合はデフォルトのLoggerを作成する", () => {
                vi.mocked(Logger).mockImplementation(
                    () =>
                        ({
                            debug: vi.fn(),
                            info: vi.fn(),
                            logError: vi.fn(),
                        }) as unknown as Logger,
                );

                const result = getLogger();

                expect(Logger).toHaveBeenCalled();
                expect(result).toBeDefined();
            });

            test("複数回呼び出してもシングルトンパターンで同じインスタンスを返す", () => {
                const mockLogger = {
                    debug: vi.fn(),
                    info: vi.fn(),
                    logError: vi.fn(),
                };

                vi.mocked(Logger).mockImplementation(() => mockLogger as unknown as Logger);

                const logger1 = getLogger();
                const logger2 = getLogger();

                // 1回目の呼び出しでLoggerが作成される
                // 2回目以降はキャッシュされたインスタンスを返すため、Loggerコンストラクタは1回しか呼ばれない
                expect(logger1).toBe(logger2);
            });

            test("defaultContextにserviceを設定する", () => {
                // globalThis.windowを未定義にする（Node.js環境のシミュレーション）
                const originalWindow = globalThis.window;
                // @ts-expect-error - テストのためにwindowを削除
                delete globalThis.window;

                getLogger();

                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        defaultContext: { service: "admin" },
                    }),
                );

                // 元に戻す
                globalThis.window = originalWindow;
            });
        });

        describe("境界値", () => {
            test("localhostの場合はminLevelをDEBUGに設定する", () => {
                // windowオブジェクトのモック
                const mockWindow = {
                    location: {
                        hostname: "localhost",
                    },
                };

                // @ts-expect-error - テストのためにwindowをモック
                globalThis.window = mockWindow;

                // loggerをリセットするため、モジュールを再インポート
                getLogger();

                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        minLevel: LogLevel.DEBUG,
                    }),
                );

                // クリーンアップ
                // @ts-expect-error - テストのためにwindowを削除
                delete globalThis.window;
            });

            test("localhost以外の場合はminLevelをINFOに設定する", () => {
                // windowオブジェクトのモック
                const mockWindow = {
                    location: {
                        hostname: "example.com",
                    },
                };

                // @ts-expect-error - テストのためにwindowをモック
                globalThis.window = mockWindow;

                getLogger();

                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        minLevel: LogLevel.INFO,
                    }),
                );

                // クリーンアップ
                // @ts-expect-error - テストのためにwindowを削除
                delete globalThis.window;
            });

            test("windowが未定義の場合はminLevelをINFOに設定する", () => {
                // windowを未定義にする
                const originalWindow = globalThis.window;
                // @ts-expect-error - テストのためにwindowを削除
                delete globalThis.window;

                getLogger();

                expect(Logger).toHaveBeenCalledWith(
                    expect.objectContaining({
                        minLevel: LogLevel.INFO,
                    }),
                );

                // 元に戻す
                globalThis.window = originalWindow;
            });
        });
    });
});
