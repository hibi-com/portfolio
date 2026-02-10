import { Button, cn, Sheet, SheetContent, SheetTrigger } from "@portfolio/ui";
import { Link as RouterLink, useLocation } from "@remix-run/react";
import { Menu } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { SITE_AUTHOR } from "~/shared/config/constants";
import { navLinks, socialLinks } from "../lib/NavData";
import type { NavLink, SocialLink } from "../model/types";
import { ThemeToggle } from "./ThemeToggle";

function useScrollToHash() {
    return (hash: string, callback?: () => void) => {
        const element = document.querySelector(hash);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            callback?.();
        }
    };
}

const Monogram = ({ highlight }: { highlight?: boolean }) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="32" height="32" rx="4" fill={highlight ? "currentColor" : "transparent"} />
        <text x="16" y="22" textAnchor="middle" fontSize="20" fill="currentColor">
            MS
        </text>
    </svg>
);

const Icon = ({ className, icon }: { className?: string; icon: string }) => {
    const iconMap: Record<string, ReactNode> = {
        github: (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <title>GitHub icon</title>
                <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.32c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.027 1.592 1.027 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    fill="currentColor"
                />
            </svg>
        ),
    };

    return <span className={className}>{iconMap[icon] || icon}</span>;
};

export const Navbar = () => {
    const [current, setCurrent] = useState<string | undefined>();
    const [menuOpen, setMenuOpen] = useState(false);
    const [target, setTarget] = useState<string | null>(null);
    const location = useLocation();
    const scrollToHash = useScrollToHash();

    useEffect(() => {
        setCurrent(`${location.pathname}${location.hash}`);
    }, [location]);

    useEffect(() => {
        if (!target || location.pathname !== "/") return;
        setCurrent(`${location.pathname}${target}`);
        scrollToHash(target, () => setTarget(null));
    }, [location.pathname, scrollToHash, target]);

    const getCurrent = (url = ""): "page" | undefined => {
        const nonTrailing = current?.endsWith("/") ? current?.slice(0, -1) : current;

        if (url === nonTrailing) {
            return "page";
        }

        return undefined;
    };

    const handleNavItemClick = (event: MouseEvent<HTMLAnchorElement>) => {
        const hash = event.currentTarget.href.split("#")[1];
        setTarget(null);

        if (hash && location.pathname === "/") {
            setTarget(`#${hash}`);
            event.preventDefault();
        }
    };

    const handleMobileNavClick = (event: MouseEvent<HTMLAnchorElement>) => {
        handleNavItemClick(event);
        setMenuOpen(false);
    };

    return (
        <header className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4 md:h-16 md:px-6">
            <RouterLink
                prefetch="intent"
                to={location.pathname === "/" ? "/#intro" : "/"}
                className="flex items-center justify-center p-2 text-foreground transition-colors hover:text-primary"
                aria-label={`${SITE_AUTHOR}, Software Engineer`}
                onClick={handleMobileNavClick}
            >
                <Monogram highlight />
            </RouterLink>

            <nav className="hidden md:flex md:items-center md:gap-6">
                {navLinks.map(({ label, pathname }: NavLink) => (
                    <RouterLink
                        prefetch="intent"
                        to={pathname}
                        key={label}
                        className={cn(
                            "px-4 py-2 font-medium text-sm transition-colors hover:text-primary",
                            getCurrent(pathname) === "page" && "text-primary",
                        )}
                        aria-current={getCurrent(pathname)}
                        onClick={handleNavItemClick}
                    >
                        {label}
                    </RouterLink>
                ))}
                <NavbarIcons />
                <ThemeToggle />
            </nav>

            <div className="flex items-center gap-2 md:hidden">
                <ThemeToggle />
                <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Menu">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                        <nav className="flex flex-col gap-4">
                            {navLinks.map(({ label, pathname }: NavLink) => (
                                <RouterLink
                                    prefetch="intent"
                                    to={pathname}
                                    key={label}
                                    className={cn(
                                        "px-4 py-2 font-medium text-lg transition-colors hover:text-primary",
                                        getCurrent(pathname) === "page" && "text-primary",
                                    )}
                                    aria-current={getCurrent(pathname)}
                                    onClick={handleMobileNavClick}
                                >
                                    {label}
                                </RouterLink>
                            ))}
                            <NavbarIcons />
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
};

const NavbarIcons = () => (
    <div className="flex items-center gap-2">
        {socialLinks.map(({ label, url, icon }: SocialLink) => (
            <a
                key={label}
                className="flex items-center justify-center p-2 text-muted-foreground transition-colors hover:text-primary"
                aria-label={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Icon icon={icon} />
            </a>
        ))}
    </div>
);
