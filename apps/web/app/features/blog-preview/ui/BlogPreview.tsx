import { Link } from "@remix-run/react";
import classnames from "classnames";
import type { BlogPreviewProps } from "../model/types";

export const BlogPreview = (props: BlogPreviewProps) => {
    const { className, date, heading = "h3", slug, image, title } = props;

    const Heading = heading as React.ElementType;
    const created = new Date(date);
    const dateString = created.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        timeZone: "UTC",
        weekday: undefined,
        year: "numeric",
    });

    return (
        <Link
            className={classnames("blog-preview relative flex flex-col", className)}
            prefetch="intent"
            to={`/blog/${slug}`}
        >
            <img
                alt={title}
                className="transition-transform duration-300 ease-in-out hover:scale-105"
                height="auto"
                loading="lazy"
                src={image}
                width="auto"
            />

            <Heading className="mt-4 mb-2 text-2xl">{title}</Heading>
            <div className="font-font-monospace text-sm">{dateString}</div>
        </Link>
    );
};
