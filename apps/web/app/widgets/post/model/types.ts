import type { ReactNode } from "react";

export interface PostProps {
    children: ReactNode;
    title: string;
    date: string;
    banner?: string;
    timecode?: string;
}
