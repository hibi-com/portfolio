import { Button, cn } from "@portfolio/ui";
import { forwardRef, useEffect, useRef, useState } from "react";
import type {
    ProjectBackgroundProps,
    ProjectContainerProps,
    ProjectHeaderProps,
    ProjectImageProps,
    ProjectSectionColumnsProps,
    ProjectSectionContentProps,
    ProjectSectionHeadingProps,
    ProjectSectionProps,
    ProjectSectionTextProps,
    ProjectTextRowProps,
} from "../model/types";

const initDelay = 300;

export function ProjectHeader({
    title,
    description,
    linkLabel = "Visit website",
    url,
    roles,
    className,
}: Readonly<ProjectHeaderProps>) {
    return (
        <section className={cn("relative w-full", className)}>
            <div className="flex flex-col items-center justify-center gap-8 p-12 md:p-20">
                <div className="flex flex-col gap-4">
                    <h1 className="font-extrabold font-serif text-4xl md:text-6xl">{title}</h1>
                    <p className="text-lg text-muted-foreground">{description}</p>
                    {!!url && (
                        <Button asChild className="mt-4 w-fit">
                            <a type="button" href={url} target="_blank" rel="noopener noreferrer">
                                {linkLabel}
                            </a>
                        </Button>
                    )}
                </div>
                {!!roles?.length && (
                    <ul className="mt-8 flex flex-wrap gap-4">
                        {roles.map((role, index) => (
                            <li
                                className="fade-in slide-in-from-bottom-4 animate-in rounded-md bg-muted px-4 py-2 text-sm"
                                style={{
                                    animationDelay: `${initDelay + 300 + index * 140}ms`,
                                    animationFillMode: "forwards",
                                }}
                                key={role}
                            >
                                <span>{role}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

export const ProjectContainer = ({ className, ...rest }: ProjectContainerProps) => (
    <article className={cn("relative flex w-full flex-col items-center justify-center", className)} {...rest} />
);

export const ProjectSection = forwardRef<HTMLElement, ProjectSectionProps>(
    (
        {
            className,
            light,
            padding = "both",
            fullHeight,
            backgroundOverlayOpacity = 0.9,
            backgroundElement,
            children,
            ...rest
        },
        ref,
    ) => {
        const paddingClasses = {
            both: "py-12 md:py-20 lg:py-24",
            top: "pt-12 md:pt-20 lg:pt-24",
            bottom: "pb-12 md:pb-20 lg:pb-24",
            none: "",
        };

        return (
            <section
                className={cn("relative grid w-full", fullHeight && "min-h-screen", light && "bg-muted", className)}
                ref={ref}
                {...rest}
            >
                {!!backgroundElement && (
                    <div
                        className="grid-area-[1/1] opacity-(--opacity)"
                        style={{ "--opacity": backgroundOverlayOpacity } as React.CSSProperties}
                    >
                        {backgroundElement}
                    </div>
                )}
                <div
                    className={cn(
                        "grid-area-[1/1] relative flex flex-col items-center justify-center",
                        paddingClasses[padding],
                    )}
                >
                    {children}
                </div>
            </section>
        );
    },
);

ProjectSection.displayName = "ProjectSection";

export const ProjectBackground = ({ opacity = 0.7, className, src, alt = "", ...rest }: ProjectBackgroundProps) => {
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!imageRef.current) return;
            const scrollY = window.scrollY;
            const offset = scrollY * 0.6;
            imageRef.current.style.setProperty("--offset", `${offset}px`);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={cn("absolute inset-0 overflow-hidden", className)}>
            <div className="absolute inset-0 translate-y-(--offset,0px)" ref={imageRef}>
                {src && (
                    <img src={src} alt={alt} role="presentation" className="h-full w-full object-cover" {...rest} />
                )}
            </div>
            <div className="absolute inset-0 bg-black/70" style={{ opacity }} />
        </div>
    );
};

export const ProjectImage = ({ className, alt, src, ...rest }: ProjectImageProps) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={cn("w-full", className)}>
            {src && (
                <img
                    src={src}
                    alt={alt}
                    className={cn(
                        "h-auto w-full transition-opacity duration-300",
                        visible ? "opacity-100" : "opacity-0",
                    )}
                    {...rest}
                />
            )}
        </div>
    );
};

const widthClasses = {
    s: "max-w-md",
    m: "max-w-2xl",
    l: "max-w-4xl",
    xl: "max-w-6xl",
};

export const ProjectSectionContent = ({ className, width = "l", ...rest }: ProjectSectionContentProps) => (
    <div className={cn("mx-auto w-full px-4", widthClasses[width], className)} {...rest} />
);

export const ProjectSectionHeading = ({
    className,
    level = 3,
    as: As = "h2",
    children,
    ...rest
}: ProjectSectionHeadingProps) => (
    <As className={cn("mb-4 font-extrabold font-serif text-3xl md:text-4xl", className)} {...rest}>
        {children}
    </As>
);

export const ProjectSectionText = ({ className, children, ...rest }: ProjectSectionTextProps) => (
    <p className={cn("mb-4 text-base text-muted-foreground md:text-lg", className)} {...rest}>
        {children}
    </p>
);

const justifyClasses = {
    center: "justify-center",
    start: "justify-start",
    end: "justify-end",
    "space-between": "justify-between",
};

export const ProjectTextRow = ({
    center,
    stretch,
    justify = "center",
    width = "m",
    noMargin,
    className,
    centerMobile,
    ...rest
}: ProjectTextRowProps) => (
    <div
        className={cn(
            "flex flex-col gap-4 md:flex-row",
            justifyClasses[justify],
            center && "items-center",
            stretch && "items-stretch",
            centerMobile && "md:items-center",
            !noMargin && "mb-8",
            widthClasses[width],
            className,
        )}
        {...rest}
    />
);

export const ProjectSectionColumns = ({ className, centered, ...rest }: ProjectSectionColumnsProps) => (
    <ProjectSectionContent
        className={cn("grid grid-cols-1 gap-8 md:grid-cols-2", centered && "items-center", className)}
        {...rest}
    />
);
