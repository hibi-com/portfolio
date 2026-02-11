import { AppError, ErrorCodes } from "@portfolio/log";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/shared/config/constants";
import { getLogger } from "~/shared/lib/logger";

export interface UseWebShareAPI {
    isAvailable: boolean;
    onShare: (url: string) => Promise<void>;
}

export const useWebShareAPI = (): UseWebShareAPI => {
    const isAvailable = globalThis.window !== undefined && !!navigator.share;
    const logger = getLogger();

    const data: ShareData = {
        text: SITE_DESCRIPTION,
        title: `Join me on ${SITE_TITLE}`,
    };

    const onShare = async (url: string) => {
        if (!isAvailable) return;

        try {
            await navigator.share({ ...data, url });
            const gtag = (globalThis as unknown as Window).gtag;
            if (!gtag) return;
            gtag("event", "share", { method: "Web Share" });
        } catch (error) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Web Share error", {
                metadata: { url },
                originalError: error instanceof Error ? error : new Error(String(error)),
            });
            logger.error(appError.message, appError, { url });
        }
    };

    return {
        isAvailable,
        onShare,
    };
};
