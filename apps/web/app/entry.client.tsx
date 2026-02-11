import { AppError, ErrorCodes } from "@portfolio/log";
import { RemixBrowser } from "@remix-run/react";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { SENTRY_DSN, SENTRY_ENVIRONMENT, XSTATE_INSPECTOR_ENABLED } from "~/shared/config/settings";
import { getLogger, initLogger } from "~/shared/lib/logger";

if (SENTRY_DSN !== "__undefined__") {
    initLogger({
        SENTRY_DSN,
        NODE_ENV: SENTRY_ENVIRONMENT,
    });
}

if (XSTATE_INSPECTOR_ENABLED) {
    try {
        // @ts-expect-error - Type definitions are in env.d.ts
        const module = await import("@xstate/inspect");
        module.inspect({
            iframe: false,
        });
    } catch (error) {
        const logger = getLogger();
        const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to load XState inspector", {
            originalError: error instanceof Error ? error : new Error(String(error)),
        });
        logger.warn(appError.message, { error: appError });
    }
}

function hydrate() {
    startTransition(() => {
        hydrateRoot(
            document,
            <StrictMode>
                <RemixBrowser />
            </StrictMode>,
        );
    });
}

if (globalThis.requestIdleCallback) {
    globalThis.requestIdleCallback(hydrate);
} else {
    globalThis.setTimeout(hydrate, 1);
}

if ("serviceWorker" in navigator) {
    globalThis.addEventListener("load", () => {
        navigator.serviceWorker.register("/worker.js");
    });
} else {
    const logger = getLogger();
    logger.warn("Service workers are not supported in this browser.");
}
