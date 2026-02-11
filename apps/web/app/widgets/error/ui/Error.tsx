import { Button, cn } from "@portfolio/ui";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { ErrorProps } from "../model/types";
import flatlineSkull from "./error-flatline.svg";

const notFoundPoster = "/assets/notfound.jpg";
const flatlinePoster = "/assets/flatline.png";
const flatlineVideo = "/assets/flatline.mp4";

interface ErrorData {
    status?: number;
    statusText?: string;
    data?: string;
    toString?: () => string;
}

interface ErrorMessage {
    summary: string;
    message: string;
}

function getErrorMessage(error: ErrorData): ErrorMessage {
    switch (error.status) {
        case 404:
            return {
                summary: "Error: redacted",
                message:
                    "This page could not be found. It either doesn't exist or was deleted. Or perhaps you don't exist and this webpage couldn't find you.",
            };
        case 405:
            return {
                summary: "Error: method denied",
                message: error.data || "",
            };
        default:
            return {
                summary: "Error: anomaly",
                message: error.statusText || error.data || error.toString?.() || "Unknown error",
            };
    }
}

function FlatlineThemeStyles() {
    return (
        <style
            dangerouslySetInnerHTML={{
                __html: `
            [data-theme='dark'] {
              --primary: oklch(69.27% 0.242 25.41);
              --accent: oklch(69.27% 0.242 25.41);
            }
            [data-theme='light'] {
              --primary: oklch(56.29% 0.182 26.5);
              --accent: oklch(56.29% 0.182 26.5);
            }
          `,
            }}
        />
    );
}

interface ErrorContentProps {
    readonly error: ErrorData;
    readonly summary: string;
    readonly message: string;
    readonly flatlined: boolean;
    readonly visible: boolean;
}

function ErrorContent({ error, summary, message, flatlined, visible }: ErrorContentProps) {
    if (flatlined) {
        return (
            <>
                <h1
                    className={cn(
                        "mb-4 flex items-center gap-4 whitespace-nowrap text-primary transition-all delay-100 duration-500",
                        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                    )}
                >
                    <svg
                        width="60"
                        height="80"
                        viewBox="0 0 60 80"
                        className="shrink-0 text-accent"
                        aria-label="Skull icon"
                    >
                        <title>Skull icon</title>
                        <use href={`${flatlineSkull}#skull`} />
                    </svg>
                    <span>Flatlined</span>
                </h1>
                <p
                    className={cn(
                        "pb-4 transition-all delay-300 duration-500",
                        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                    )}
                >
                    {message}
                </p>
                <a
                    className={cn(
                        "self-start pl-1 transition-all delay-500 duration-500",
                        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                    )}
                    href="https://www.youtube.com/watch?v=EuQzHGcsjlA"
                >
                    <Button>Emotional support</Button>
                </a>
            </>
        );
    }

    return (
        <>
            <h1
                className={cn(
                    "mb-4 transition-all delay-100 duration-500",
                    visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
            >
                {error.status}
            </h1>
            <div
                aria-hidden
                className={cn(
                    "max-w-full shrink-0 overflow-hidden whitespace-nowrap pb-4 text-muted-foreground uppercase tracking-wider transition-all delay-200 duration-500",
                    visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
            >
                {summary}
            </div>
            <p
                className={cn(
                    "pb-4 transition-all delay-300 duration-500",
                    visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
            >
                {message}
            </p>
            <Link
                className={cn(
                    "self-start pl-1 transition-all delay-500 duration-500",
                    visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
                to="/"
            >
                <Button>Back to homepage</Button>
            </Link>
        </>
    );
}

interface VideoCreditProps {
    readonly flatlined: boolean;
    readonly visible: boolean;
}

function VideoCredit({ flatlined, visible }: VideoCreditProps) {
    if (flatlined) {
        return (
            <a
                className={cn(
                    "absolute bottom-4 left-4 bg-black/60 px-2 py-1 text-sm text-white/40 no-underline transition-all delay-800 duration-300 hover:text-white",
                    visible ? "opacity-100" : "opacity-0",
                )}
                href="https://www.imdb.com/title/tt0318871/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Animation from Berserk (1997)
            </a>
        );
    }

    return (
        <a
            className={cn(
                "absolute bottom-4 left-4 bg-black/60 px-2 py-1 text-sm text-white/40 no-underline transition-all delay-800 duration-300 hover:text-white",
                visible ? "opacity-100" : "opacity-0",
            )}
            href="https://www.imdb.com/title/tt0113568/"
            target="_blank"
            rel="noopener noreferrer"
        >
            Animation from Ghost in the Shell (1995)
        </a>
    );
}

export function ErrorPage({ error }: Readonly<ErrorProps>) {
    const [visible, setVisible] = useState(false);
    const flatlined = !error.status;

    useEffect(() => {
        setVisible(true);
    }, []);

    const { summary, message } = getErrorMessage(error);

    return (
        <section className="grid h-screen grid-cols-1 pl-[140px] md:h-auto md:min-h-screen md:grid-cols-2 md:pt-20 md:pb-20 md:pl-20">
            {flatlined && <FlatlineThemeStyles />}
            <div className="flex h-full items-center justify-center p-0 md:row-start-2 md:p-8">
                <div className="flex w-full max-w-[480px] flex-col">
                    <ErrorContent
                        error={error}
                        summary={summary}
                        message={message}
                        flatlined={flatlined}
                        visible={visible}
                    />
                </div>
            </div>

            <div
                className={cn(
                    "relative h-full w-full overflow-hidden border-48 md:row-start-1 md:min-h-[240px] md:border-64 md:border-t-0",
                    visible ? "opacity-100" : "opacity-0",
                )}
            >
                <video
                    className={cn(
                        "md:clip-path-[polygon(0_0,calc(100%-64px)_0,100%_64px,100%_100%,0_100%)] relative h-full w-full object-cover opacity-0 transition-opacity delay-800 duration-500",
                        visible && "opacity-100",
                    )}
                    src={flatlineVideo}
                    poster={flatlined ? flatlinePoster : notFoundPoster}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                <VideoCredit flatlined={flatlined} visible={visible} />
            </div>
        </section>
    );
}
