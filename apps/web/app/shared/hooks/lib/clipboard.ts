import { AppError, ErrorCodes } from "@portfolio/log";
import { getLogger } from "~/shared/lib/logger";

export const copyTextToClipboard = (text: string) => {
    const logger = getLogger();
    logger.debug("Copy text to Clipboard", { text });

    if (!navigator.clipboard) {
        const appError = AppError.fromCode(
            ErrorCodes.EXTERNAL_API_ERROR,
            "Clipboard API is not available. This feature requires a secure context (HTTPS or localhost).",
        );
        logger.warn(appError.message);
        return;
    }

    navigator.clipboard.writeText(text).then(
        () => {
            logger.debug("Copied to clipboard", { text });
        },
        (err) => {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Could not copy text", {
                metadata: { text },
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.error(appError.message, appError);
        },
    );
};
