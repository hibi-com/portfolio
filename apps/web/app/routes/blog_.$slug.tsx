import { Wysiwyg } from "@portfolio/ui";
import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import stylesLines from "prismjs/plugins/line-numbers/prism-line-numbers.css?url";
import stylesTheme from "prismjs/themes/prism-tomorrow.css?url";
import type { LoaderData } from "~/routes/api.blog.$slug";
import { Hero } from "~/widgets/hero";
import "prismjs/plugins/line-numbers/prism-line-numbers";

export const links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: stylesLines },
        { rel: "stylesheet", href: stylesTheme },
    ];
};

export { loader } from "~/routes/api.blog.$slug";

export const meta: MetaFunction = (args) => {
    const data = args.data as LoaderData | undefined;
    return [
        {
            title: data?.title || "Blog | Post not found!",
        },
        {
            name: "description",
            content: data?.intro,
        },
        {
            tagName: "link",
            rel: "canonical",
            href: data?.images?.[0]?.url,
        },
    ];
};

export default function Blog_Slug() {
    const data = useLoaderData<LoaderData>();

    const created = new Date(data.date);
    const date = created.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        timeZone: "UTC",
        weekday: undefined,
        year: "numeric",
    });

    return (
        <>
            <section className="mx-auto max-w-6xl">
                <Hero className="py-20 md:py-40" copy={date} highlight={data.title} tag="h1" />
            </section>

            <img
                alt={data.title}
                className="w-full border-color-border-dark border-t border-b"
                height="auto"
                loading="eager"
                src={data.imageTemp}
                width="100%"
            />

            <section className="m-auto max-w-4xl">
                <div className="mb-20 p-4">
                    <div className="my-8 md:my-12">
                        <h2 className="m-0 mb-2 inline-block text-left text-3xl text-highlight md:text-4xl">
                            {data.title}
                        </h2>
                        <div className="font-font-monospace text-sm">{date}</div>
                    </div>

                    <Wysiwyg content={data.content.raw as string} />
                </div>
            </section>
        </>
    );
}
