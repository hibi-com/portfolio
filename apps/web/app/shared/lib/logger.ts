import { initSentry, Logger, LogLevel } from "@portfolio/log";

let logger: Logger | null = null;

export function initLogger(env: { SENTRY_DSN?: string; NODE_ENV?: string; APP_VERSION?: string }): void {
    if (env.SENTRY_DSN) {
        initSentry({
            dsn: env.SENTRY_DSN,
            environment: env.NODE_ENV || "development",
            release: env.APP_VERSION,
            tracesSampleRate: env.NODE_ENV === "production" ? 0.1 : 1,
        });
    }

    logger = new Logger({
        minLevel: env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG,
        sendToSentry: !!env.SENTRY_DSN,
        sentryMinLevel: LogLevel.ERROR,
        defaultContext: {
            service: "web",
            environment: env.NODE_ENV || "development",
        },
    });
}

export function getLogger(): Logger {
    if (!logger) {
        logger = new Logger({
            minLevel: globalThis.window?.location.hostname === "localhost" ? LogLevel.DEBUG : LogLevel.INFO,
            defaultContext: { service: "web" },
        });
    }
    return logger;
}
