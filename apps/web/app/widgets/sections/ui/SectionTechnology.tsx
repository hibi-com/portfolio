import { sanitizeHtml } from "@portfolio/ui";
import classnames from "classnames";
import { useRef, useState } from "react";
import { data } from "~/shared/data/details";

export const SectionTechnology = () => {
    const refDescription = useRef<HTMLQuoteElement>(null);
    const [heading, setHeading] = useState<string>();

    const description = heading ? data[heading] : data.default;
    const keys = Object.keys(data).filter((key) => key !== "default");

    return (
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:py-20">
            <div className="basis-2/5">
                <h2 className="mb-8 text-xl md:text-3xl">
                    Technology <span className="ml-2">🧰</span>
                </h2>

                <div className="work-details flex flex-wrap gap-2">
                    {keys.map((key) => {
                        const active = key === heading;

                        return (
                            <button
                                className={classnames("rounded-md px-2 py-1 text-sm", {
                                    active,
                                })}
                                key={key}
                                onClick={() => {
                                    const newValue = heading === key ? undefined : key;
                                    setHeading(newValue);
                                }}
                                type="button"
                            >
                                {key}
                            </button>
                        );
                    })}
                </div>
            </div>

            <blockquote
                className="my-8 basis-3/5 font-light text-xl leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(description ?? "") }}
                ref={refDescription}
            />
        </div>
    );
};
