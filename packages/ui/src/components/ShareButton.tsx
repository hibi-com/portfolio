import { cn } from "@portfolio/ui";

export interface ShareOptions {
    url?: string;
    title?: string;
    text?: string;
}

export interface ShareButtonProps {
    url?: string;
    title?: string;
    text?: string;
    className?: string;
    showLabel?: boolean;
    disabled?: boolean;
    onShare: (options: ShareOptions) => void | Promise<void>;
    isAvailable?: boolean;
    iconSrc?: string;
    iconAlt?: string;
}

export const ShareButton = ({
    url,
    title,
    text,
    className,
    showLabel = false,
    disabled = false,
    onShare,
    isAvailable = true,
    iconSrc = "/images/svg/share.svg",
    iconAlt = "Share",
}: ShareButtonProps) => {
    if (!isAvailable) return null;

    const handleClick = () => {
        if (disabled || !onShare) return;
        onShare({ url, title, text });
    };

    return (
        <button
            type="button"
            className={cn(
                "ui-btn custom-bg-gradient whitespace-nowrap rounded-2xl px-4 py-2 font-normal text-sm text-white",
                disabled && "cursor-not-allowed opacity-50",
                className,
            )}
            onClick={handleClick}
            disabled={disabled}
        >
            <img alt={iconAlt} height={20} src={iconSrc} width={20} />
            {showLabel && <span>Share</span>}
        </button>
    );
};
