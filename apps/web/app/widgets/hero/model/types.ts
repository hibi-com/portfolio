import type { ReactElement } from "react";

export interface HeroProps {
    className?: string;
    copy?: string | ReactElement;
    highlight: string;
    tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}
