import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "../errors/app-error";
import { ErrorCodes } from "../errors/error-codes";
import { sentryClient } from "../sentry/client";
import { PlainTextFormatter } from "./formatter";
import { LogLevel } from "./levels";
import { Logger } from "./logger";

describe("Logger", () => {
    let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
    let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
    let sentryCaptureErrorSpy: ReturnType<typeof vi.spyOn>;
    let sentryCaptureMessageSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleDebugSpy = vi.spyOn(console, "debug").mockImplementation(() => undefined);
        consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);
        consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        sentryCaptureErrorSpy = vi
            .spyOn(sentryClient, "captureError")
            .mockImplementation(() => undefined) as ReturnType<typeof vi.spyOn>;
        sentryCaptureMessageSpy = vi
            .spyOn(sentryClient, "captureMessage")
            .mockImplementation(() => undefined) as ReturnType<typeof vi.spyOn>;
    });

    describe("ログレベルのフィルタリング", () => {
        it("最小レベル未満のログは出力されない", () => {
            const logger = new Logger({ minLevel: LogLevel.WARN });
            logger.debug("debug message");
            logger.info("info message");
            expect(consoleDebugSpy).not.toHaveBeenCalled();
            expect(consoleInfoSpy).not.toHaveBeenCalled();
        });

        it("最小レベル以上のログは出力される", () => {
            const logger = new Logger({ minLevel: LogLevel.INFO });
            logger.info("info message");
            logger.warn("warn message");
            logger.error("error message");
            expect(consoleInfoSpy).toHaveBeenCalled();
            expect(consoleWarnSpy).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("最小レベルと同じレベルのログは出力される", () => {
            const logger = new Logger({ minLevel: LogLevel.WARN });
            logger.warn("warn message");
            expect(consoleWarnSpy).toHaveBeenCalled();
        });
    });

    describe("ログ出力", () => {
        it("すべてのログレベルで出力できる", () => {
            const logger = new Logger({ minLevel: LogLevel.DEBUG });
            logger.debug("debug message");
            logger.info("info message");
            logger.warn("warn message");
            logger.error("error message");
            expect(consoleDebugSpy).toHaveBeenCalled();
            expect(consoleInfoSpy).toHaveBeenCalled();
            expect(consoleWarnSpy).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("エラーログが正しく出力される", () => {
            const logger = new Logger();
            const error = new Error("test error");
            logger.error("error message", error);
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("エラーなしでもエラーログを出力できる", () => {
            const logger = new Logger();
            logger.error("error message");
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("メタデータ付きログが出力される", () => {
            const logger = new Logger();
            logger.info("info message", { userId: "123", action: "login" });
            expect(consoleInfoSpy).toHaveBeenCalled();
        });
    });

    describe("AppErrorのログ記録", () => {
        it("AppErrorをログに記録できる", () => {
            const logger = new Logger();
            const appError = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN);
            logger.logError(appError);
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("AppErrorにメタデータを追加してログに記録できる", () => {
            const logger = new Logger();
            const appError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "エラー", {
                metadata: { field: "username" },
            });
            logger.logError(appError, { additional: "data" });
            expect(consoleErrorSpy).toHaveBeenCalled();
        });
    });

    describe("カスタムフォーマッター", () => {
        it("カスタムフォーマッターを使用できる", () => {
            const formatter = new PlainTextFormatter();
            const logger = new Logger({ formatter, minLevel: LogLevel.DEBUG });
            logger.info("test message");
            expect(consoleInfoSpy).toHaveBeenCalled();
            const callArgs = consoleInfoSpy.mock.calls[0];
            expect(callArgs?.[0]).toContain("test message");
        });
    });

    describe("デフォルトコンテキスト", () => {
        it("デフォルトコンテキストが設定される", () => {
            const logger = new Logger({ defaultContext: { service: "api" } });
            logger.info("message");
            expect(consoleInfoSpy).toHaveBeenCalled();
        });

        it("子ロガーが追加のコンテキストを持つ", () => {
            const logger = new Logger({ defaultContext: { service: "api" } });
            const childLogger = logger.child({ requestId: "123" });
            childLogger.info("message");
            expect(consoleInfoSpy).toHaveBeenCalled();
        });

        it("子ロガーが親の設定を継承する", () => {
            const logger = new Logger({
                minLevel: LogLevel.WARN,
                sendToSentry: true,
                defaultContext: { service: "api" },
            });
            const childLogger = logger.child({ requestId: "123" });
            childLogger.warn("message");
            expect(consoleWarnSpy).toHaveBeenCalled();
        });
    });

    describe("Sentry統合", () => {
        it("sendToSentryがfalseの場合、Sentryに送信されない", () => {
            const logger = new Logger({ sendToSentry: false });
            logger.error("error message");
            expect(sentryCaptureErrorSpy).not.toHaveBeenCalled();
            expect(sentryCaptureMessageSpy).not.toHaveBeenCalled();
        });

        it("sendToSentryがtrueで、sentryMinLevel以上の場合はSentryに送信される", () => {
            const logger = new Logger({
                sendToSentry: true,
                sentryMinLevel: LogLevel.ERROR,
            });
            logger.error("error message");
            expect(sentryCaptureMessageSpy).toHaveBeenCalled();
        });

        it("sendToSentryがtrueで、sentryMinLevel未満の場合はSentryに送信されない", () => {
            const logger = new Logger({
                sendToSentry: true,
                sentryMinLevel: LogLevel.ERROR,
            });
            logger.info("info message");
            logger.warn("warn message");
            expect(sentryCaptureMessageSpy).not.toHaveBeenCalled();
        });

        it("エラー付きログがSentryに送信される", () => {
            const logger = new Logger({
                sendToSentry: true,
                sentryMinLevel: LogLevel.ERROR,
            });
            const error = new Error("test error");
            logger.error("error message", error);
            expect(sentryCaptureErrorSpy).toHaveBeenCalledWith(
                error,
                expect.objectContaining({
                    level: LogLevel.ERROR,
                    message: "error message",
                }),
            );
        });

        it("AppErrorがSentryに送信される", () => {
            const logger = new Logger({
                sendToSentry: true,
                sentryMinLevel: LogLevel.ERROR,
            });
            const appError = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN);
            logger.logError(appError);
            expect(sentryCaptureErrorSpy).toHaveBeenCalled();
        });

        it("メタデータ付きログがSentryに送信される", () => {
            const logger = new Logger({
                sendToSentry: true,
                sentryMinLevel: LogLevel.INFO,
            });
            logger.info("info message", { userId: "123" });
            expect(sentryCaptureMessageSpy).toHaveBeenCalledWith(
                "info message",
                "info",
                expect.objectContaining({
                    level: LogLevel.INFO,
                    userId: "123",
                }),
            );
        });
    });

    describe("デフォルトロガー", () => {
        it("デフォルトロガーが作成される", async () => {
            const loggerModule = await import("./logger");
            expect(loggerModule.defaultLogger).toBeDefined();
            expect(loggerModule.defaultLogger).toBeInstanceOf(Logger);
        });
    });
});
