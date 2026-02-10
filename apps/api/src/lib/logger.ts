import { CommonMetrics, initSentry, Logger, LogLevel, PrometheusClient } from "@portfolio/log";

let logger: Logger | null = null;
let prometheus: PrometheusClient | null = null;
let metrics: CommonMetrics | null = null;

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
            service: "api",
            environment: env.NODE_ENV || "development",
        },
    });

    prometheus = new PrometheusClient();
    prometheus.collectDefaultMetrics();
    metrics = new CommonMetrics(prometheus);
}

export function getLogger(): Logger {
    if (!logger) {
        logger = new Logger({
            minLevel: LogLevel.INFO,
            defaultContext: { service: "api" },
        });
    }
    return logger;
}

export function getPrometheus(): PrometheusClient {
    if (!prometheus) {
        prometheus = new PrometheusClient();
        prometheus.collectDefaultMetrics();
    }
    return prometheus;
}

export function getMetrics(): CommonMetrics {
    if (!metrics) {
        const client = getPrometheus();
        metrics = new CommonMetrics(client);
    }
    return metrics;
}
