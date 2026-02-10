import { AppError } from "../errors/app-error";
import { sentryClient } from "../sentry/client";
import { defaultFormatter, type LogEntry, type LogFormatter } from "./formatter";
import { compareLogLevel, LogLevel } from "./levels";

export interface LoggerConfig {
    minLevel?: LogLevel;
    formatter?: LogFormatter;
    sendToSentry?: boolean;
    sentryMinLevel?: LogLevel;
    defaultContext?: Record<string, unknown>;
}

export class Logger {
    private readonly minLevel: LogLevel;
    private readonly formatter: LogFormatter;
    private readonly sendToSentry: boolean;
    private readonly sentryMinLevel: LogLevel;
    private readonly defaultContext?: Record<string, unknown>;

    constructor(config: LoggerConfig = {}) {
        this.minLevel = config.minLevel ?? LogLevel.INFO;
        this.formatter = config.formatter ?? defaultFormatter;
        this.sendToSentry = config.sendToSentry ?? false;
        this.sentryMinLevel = config.sentryMinLevel ?? LogLevel.ERROR;
        this.defaultContext = config.defaultContext;
    }

    private log(
        level: LogLevel,
        message: string,
        options?: { error?: Error; metadata?: Record<string, unknown> },
    ): void {
        if (compareLogLevel(level, this.minLevel) < 0) {
            return;
        }

        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context: this.defaultContext,
            error: options?.error,
            metadata: options?.metadata,
        };

        const formatted = this.formatter.format(entry);
        this.writeLog(level, formatted);

        if (this.sendToSentry && compareLogLevel(level, this.sentryMinLevel) >= 0) {
            if (options?.error) {
                sentryClient.captureError(options.error, {
                    level,
                    message,
                    ...options.metadata,
                });
            } else {
                const sentryLevel = this.getSentryLevel(level);
                sentryClient.captureMessage(message, sentryLevel, {
                    level,
                    ...options?.metadata,
                });
            }
        }
    }

    protected writeLog(level: LogLevel, formatted: string): void {
        switch (level) {
            case LogLevel.DEBUG:
                console.debug(formatted);
                break;
            case LogLevel.INFO:
                console.info(formatted);
                break;
            case LogLevel.WARN:
                console.warn(formatted);
                break;
            case LogLevel.ERROR:
                console.error(formatted);
                break;
        }
    }

    private getSentryLevel(level: LogLevel): "debug" | "info" | "warning" | "error" {
        switch (level) {
            case LogLevel.DEBUG:
                return "debug";
            case LogLevel.INFO:
                return "info";
            case LogLevel.WARN:
                return "warning";
            case LogLevel.ERROR:
                return "error";
        }
    }

    debug(message: string, metadata?: Record<string, unknown>): void {
        this.log(LogLevel.DEBUG, message, { metadata });
    }

    info(message: string, metadata?: Record<string, unknown>): void {
        this.log(LogLevel.INFO, message, { metadata });
    }

    warn(message: string, metadata?: Record<string, unknown>): void {
        this.log(LogLevel.WARN, message, { metadata });
    }

    error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
        this.log(LogLevel.ERROR, message, { error, metadata });
    }

    logError(error: AppError, metadata?: Record<string, unknown>): void {
        this.error(error.message, error, {
            ...error.metadata,
            code: error.code,
            category: error.category,
            httpStatus: error.httpStatus,
            ...metadata,
        });
    }

    child(context: Record<string, unknown>): Logger {
        return new Logger({
            minLevel: this.minLevel,
            formatter: this.formatter,
            sendToSentry: this.sendToSentry,
            sentryMinLevel: this.sentryMinLevel,
            defaultContext: {
                ...this.defaultContext,
                ...context,
            },
        });
    }
}

export const defaultLogger = new Logger();
