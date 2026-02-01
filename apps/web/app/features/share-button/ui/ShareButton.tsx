import { ShareButton as UIShareButton } from "@portfolio/ui";
import { useWebShareAPI } from "~/shared/hooks/lib/useWebShareAPI";
import type { ShareButtonProps } from "../model/types";

export const ShareButton = ({ url = "https://mattscholta.com/resume", ...props }: ShareButtonProps) => {
    const { isAvailable, onShare } = useWebShareAPI();

    const handleShare = async (options: { url?: string; title?: string; text?: string }) => {
        await onShare(options.url || url);
    };

    return <UIShareButton {...props} url={url} isAvailable={isAvailable} onShare={handleShare} />;
};
