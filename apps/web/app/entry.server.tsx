import { AppError, ErrorCodes } from "@portfolio/log";
import type { EntryContext } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { SENTRY_DSN, SENTRY_ENVIRONMENT } from "~/shared/config/settings";
import { getLogger, initLogger } from "~/shared/lib/logger";

if (SENTRY_DSN !== "__undefined__") {
    initLogger({
        SENTRY_DSN,
        NODE_ENV: SENTRY_ENVIRONMENT,
    });
}

async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
) {
    let statusCode = responseStatusCode;
    const logger = getLogger();
    const body = await renderToReadableStream(<RemixServer context={remixContext} url={request.url} />, {
        signal: request.signal,
        onError(error: unknown) {
            const appError =
                error instanceof AppError
                    ? error
                    : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Server rendering error", {
                          originalError: error instanceof Error ? error : new Error(String(error)),
                      });
            logger.logError(appError, { url: request.url });
            statusCode = 500;
        },
    });

    if (isbot(request.headers.get("user-agent") || "")) {
        await body.allReady;
    }

    responseHeaders.set("Content-Type", "text/html");
    responseHeaders.set("X-Frame-Options", "SAMEORIGIN");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    responseHeaders.set("X-XSS-Protection", "1; mode=block");
    responseHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    return new Response(body, {
        headers: responseHeaders,
        status: statusCode,
    });
}

export default handleRequest;
