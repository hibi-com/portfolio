import { Link } from "@remix-run/react";
import type { PortfolioPreviewProps } from "../model/types";

export const PortfolioPreview = (props: PortfolioPreviewProps) => {
    const { current = false, data } = props;

    const date = new Date(data.date);

    return (
        <Link className="work-preview text-color-copy" prefetch="intent" to={`/portfolio/${data.slug}`}>
            <h3 className="m-0 font-bold font-font-serif text-xl">{data.title}</h3>
            <div className="mt-1 mb-6 flex items-baseline gap-2 font-medium text-color-copy-dark">
                {!current && <span>{new Date(date).getFullYear()}</span>}
                {!current && <span className="font-light">|</span>}
                <span>{data.company}</span>
            </div>

            <p>{data.overview}</p>
        </Link>
    );
};
