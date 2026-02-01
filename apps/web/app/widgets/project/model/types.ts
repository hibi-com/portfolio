import type { ComponentProps, ReactNode } from "react";

export interface ProjectHeaderProps {
    readonly title: string;
    readonly description: string;
    readonly linkLabel?: string;
    readonly url?: string;
    readonly roles?: readonly string[];
    readonly className?: string;
}

export interface ProjectContainerProps extends ComponentProps<"article"> {
    readonly className?: string;
}

export interface ProjectSectionProps extends ComponentProps<"section"> {
    readonly className?: string;
    readonly light?: boolean;
    readonly padding?: "both" | "top" | "bottom" | "none";
    readonly fullHeight?: boolean;
    readonly backgroundOverlayOpacity?: number;
    readonly backgroundElement?: ReactNode;
    readonly children: ReactNode;
}

export interface ProjectBackgroundProps extends ComponentProps<"img"> {
    readonly opacity?: number;
    readonly className?: string;
    readonly src?: string;
    readonly alt?: string;
}

export interface ProjectImageProps extends ComponentProps<"img"> {
    readonly className?: string;
    readonly alt: string;
    readonly src?: string;
}

export interface ProjectSectionContentProps extends ComponentProps<"div"> {
    readonly className?: string;
    readonly width?: "s" | "m" | "l" | "xl";
}

export interface ProjectSectionHeadingProps extends ComponentProps<"h1"> {
    readonly className?: string;
    readonly level?: number;
    readonly as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface ProjectSectionTextProps extends ComponentProps<"p"> {
    readonly className?: string;
}

export interface ProjectTextRowProps extends ComponentProps<"div"> {
    readonly center?: boolean;
    readonly stretch?: boolean;
    readonly justify?: "center" | "start" | "end" | "space-between";
    readonly width?: "s" | "m" | "l" | "xl";
    readonly noMargin?: boolean;
    readonly className?: string;
    readonly centerMobile?: boolean;
}

export interface ProjectSectionColumnsProps extends ProjectSectionContentProps {
    readonly centered?: boolean;
}
