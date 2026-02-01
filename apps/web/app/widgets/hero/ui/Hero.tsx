import { cn } from "@portfolio/ui";
import type { HeroProps } from "../model/types";

export const Hero = (props: HeroProps) => {
    const { className, copy, highlight, tag: Tag = "h2" } = props;

    return (
        <div className={cn("p-4 text-center leading-tight", className)}>
            <Tag className="inline-block font-extrabold font-serif text-xl md:text-4xl">
                {copy && <div className="font-mono font-normal text-base md:text-2xl">{copy}</div>}
                <div className="bg-linear-to-r from-primary to-blue-500 bg-clip-text px-3 text-4xl text-transparent leading-tight tracking-tight md:text-7xl">
                    {highlight}
                </div>
            </Tag>
        </div>
    );
};
