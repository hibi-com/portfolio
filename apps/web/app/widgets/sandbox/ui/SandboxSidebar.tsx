import { Link } from "@remix-run/react";
import classnames from "classnames";
import type { SandboxSidebarProps } from "../model/types";

interface SandboxItem {
    title: string;
    slug: string;
    description?: string;
}

const sandboxItems: SandboxItem[] = [
    {
        title: "CSS Polaroid",
        slug: "css-polaroid",
        description: "A Polaroid camera made with CSS",
    },
];

/**
 * @name SandboxSidebar
 * @description Sidebar navigation for sandbox projects and experiments
 */
export const SandboxSidebar = (props: SandboxSidebarProps) => {
    const { className } = props;

    return (
        <aside className={classnames("sandbox-sidebar w-full p-4 md:w-64 md:p-6", className)}>
            <nav className="flex flex-col gap-4">
                <h3 className="mb-2 font-bold font-font-serif text-lg">Sandboxes</h3>
                <ul className="flex flex-col gap-2">
                    {sandboxItems.map((item) => (
                        <li key={item.slug}>
                            <Link
                                className="block rounded p-2 transition-colors hover:bg-color-background-light/10"
                                prefetch="intent"
                                to={`/sandbox/${item.slug}`}
                            >
                                <div className="font-medium">{item.title}</div>
                                {item.description && (
                                    <div className="mt-1 text-color-background-light/70 text-sm">
                                        {item.description}
                                    </div>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};
