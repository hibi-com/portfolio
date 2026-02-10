import { SocialLink } from "@portfolio/ui";
import type { MetaFunction } from "@remix-run/cloudflare";
import { ShareButton } from "~/features/share-button";
import { SITE_AUTHOR, SITE_TITLE, SITE_YEAR } from "~/shared/config/constants";
import { social } from "~/shared/data/resume";
import { SectionEducation, SectionExperience } from "~/widgets/sections";

export const meta: MetaFunction = (_args) => {
    return [
        {
            title: `${SITE_YEAR} Resume | ${SITE_TITLE}`,
        },
        {
            name: "description",
            content: `The online resume of ${SITE_AUTHOR}, a Software Engineer located in San Diego, California.`,
        },
    ];
};

export default function Resume() {
    return (
        <div className="m-auto max-w-5xl py-10 md:py-20">
            <div className="flex flex-col gap-20 px-4 md:flex-row md:px-0">
                <aside className="md:w-1/5 print:hidden">
                    <div className="sticky top-32">
                        <div className="flex flex-row items-center justify-center gap-6 md:flex-col">
                            <img
                                alt={SITE_AUTHOR}
                                className="custom-bg-gradient aspect-square max-h-48 overflow-hidden rounded-full p-1"
                                height="auto"
                                loading="eager"
                                src="/images/assets/matt-scaled.webp"
                                width="auto"
                            />
                            <div className="flex shrink-0 flex-col gap-2 p-4">
                                {social.map((data) => (
                                    <SocialLink data={data} key={data.title} />
                                ))}
                            </div>
                        </div>
                        <div className="mt-8 flex gap-4 print:hidden">
                            <a
                                className="ui-btn custom-bg-gradient flex-1 whitespace-nowrap rounded-2xl px-4 py-2 text-center font-normal text-sm text-white"
                                download={true}
                                href="/resume/Matthew_Scholta_2024.pdf"
                            >
                                Download Resume
                            </a>
                            <ShareButton />
                        </div>
                    </div>
                </aside>

                <div className="resume-sections mb-20 flex flex-1 flex-col gap-10">
                    <section>
                        <h1 className="uppercase- mb-10 font-extrabold text-2xl md:text-4xl">
                            <span className="sr-only">The {SITE_YEAR} online resume of </span>
                            {SITE_AUTHOR}
                        </h1>
                        <div className="mb-8 border-color-border border-t border-solid print:hidden" />
                        <div className="flex items-center gap-10">
                            <p>
                                <span className="mr-1">👨‍💻</span> A Software Engineer whose passion lies in creating{" "}
                                <b>quality code</b> written <b>for humans</b>, unlocking <b>developer productivity</b>,
                                and creating a delightful <b>user experience</b>.
                            </p>
                        </div>
                    </section>
                    <SectionExperience />
                    <SectionEducation />
                </div>
            </div>
        </div>
    );
}
