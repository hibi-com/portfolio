import { cn } from "@portfolio/ui";
import { Link as RouterLink } from "@remix-run/react";
import { ChevronDown } from "lucide-react";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Footer } from "~/widgets/footer";
import type { PostProps } from "../model/types";

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function useParallax(speed: number, callback: (value: number) => void) {
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            callback(scrollY * speed);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [speed, callback]);
}

function useScrollToHash() {
    return (hash: string, callback?: () => void) => {
        const element = document.querySelector(hash);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            callback?.();
        }
    };
}

export const Post = ({ children, title, date, banner, timecode }: PostProps) => {
    const imageRef = useRef<HTMLDivElement>(null);
    const [dateTime, setDateTime] = useState<string | null>(null);

    useEffect(() => {
        setDateTime(formatDate(date));
    }, [date]);

    useParallax(0.004, (value: number) => {
        if (!imageRef.current) return;
        imageRef.current.style.setProperty("--blurOpacity", String(clamp(value, 0, 1)));
    });

    const scrollToHash = useScrollToHash();

    const handleScrollIndicatorClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        scrollToHash(event.currentTarget.href);
    };

    const placeholder = banner ? `${banner.split(".")[0]}-placeholder.jpg` : undefined;

    const [visible, setVisible] = useState(false);
    const nodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setVisible(true);
    }, []);

    return (
        <article className="relative grid overflow-x-hidden">
            <section>
                {banner && placeholder && (
                    <div className="absolute inset-x-0 top-0 isolate h-[70vh] overflow-hidden" ref={imageRef}>
                        <div className="absolute inset-0">
                            <img src={banner} alt="" loading="lazy" className="h-[70vh] w-full object-cover" />
                        </div>
                        <div
                            className="absolute inset-0 opacity-0 transition-opacity"
                            style={{ opacity: "var(--blurOpacity, 0)" }}
                        >
                            <img src={placeholder} alt="" loading="lazy" className="h-[70vh] w-full object-cover" />
                        </div>
                        <div className="absolute inset-0 z-1 bg-linear-to-b from-background/70 via-background/90 to-background" />
                    </div>
                )}
                <header className="relative grid grid-cols-[1fr_60px_680px_60px_1fr] items-center gap-4 md:grid-cols-[1fr_100px_740px_100px_1fr] lg:grid-cols-[1fr_100px_740px_100px_1fr]">
                    <div className="relative col-start-3 flex h-full w-full max-w-[800px] flex-col justify-center gap-8 pt-20 md:col-start-3 md:pt-24">
                        <div className="relative grid grid-cols-[100px_1fr] items-center gap-4 md:gap-4" ref={nodeRef}>
                            <div
                                className="h-2 bg-primary transition-all duration-300 ease-in-out"
                                style={{
                                    width: visible ? "64px" : "0",
                                }}
                            />
                            <p
                                className={cn(
                                    "text-primary opacity-0 transition-opacity duration-500",
                                    visible && "opacity-100",
                                )}
                            >
                                {dateTime}
                            </p>
                        </div>
                        <h1 className="font-extrabold font-serif text-4xl leading-tight md:text-6xl" aria-label={title}>
                            {title.split(" ").map((word, index) => (
                                <span className="inline-block overflow-hidden" key={`${title}-word-${index}`}>
                                    <span
                                        className="slide-in-from-bottom-5 inline-block animate-in whitespace-pre duration-500"
                                        style={{
                                            animationDelay: `${index * 100 + 100}ms`,
                                            animationFillMode: "forwards",
                                        }}
                                    >
                                        {word}
                                        {index === title.split(" ").length - 1 ? "" : " "}
                                    </span>
                                </span>
                            ))}
                        </h1>
                        <div className="flex items-center justify-between gap-4">
                            <RouterLink
                                to="#postContent"
                                className="fade-in relative -left-4 animate-in p-4 opacity-0 delay-1000 duration-600"
                                aria-label="Scroll to post content"
                                onClick={handleScrollIndicatorClick}
                            >
                                <ChevronDown className="h-6 w-6 stroke-muted-foreground" />
                            </RouterLink>
                            {timecode && (
                                <div className="fade-in grid animate-in grid-cols-[60px_1fr] items-center gap-2.5 py-4 text-base text-muted-foreground opacity-0 delay-1000 duration-600">
                                    <div className="h-0.5 bg-muted-foreground/40" />
                                    <span>{timecode}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            </section>
            <section
                className="flex flex-col overflow-hidden pt-[calc(60px+2rem)] pb-8 md:pt-[calc(100px+2rem)]"
                id="postContent"
                tabIndex={-1}
            >
                <div className="fade-in grid w-full animate-in grid-cols-[1fr_60px_680px_60px_1fr] self-center opacity-0 delay-1000 duration-1200 md:grid-cols-[1fr_100px_740px_100px_1fr]">
                    <div className="col-start-3">{children}</div>
                </div>
            </section>
            <Footer />
        </article>
    );
};
