export interface FooterSocialLink {
    platform: "linkedin" | "github" | "twitter";
    url: string;
    alt: string;
    iconSrc: string;
}

export interface FooterConfig {
    socialLinks?: FooterSocialLink[];
    footerText?: string;
    location?: string;
    locationUrl?: string;
    hideOnResume?: boolean;
}

export interface FooterProps {
    config?: FooterConfig;
    className?: string;
    forceShow?: boolean;
}

export interface FooterMobileProps {
    config?: FooterConfig;
    className?: string;
    forceShow?: boolean;
}
