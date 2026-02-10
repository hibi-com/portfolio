import type { TrackingGAProps } from "../model/types";

export const TrackingGA = (props: TrackingGAProps) => {
    const { id } = props;

    const src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    const __html = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${id}');`;

    return (
        <>
            <script async={true} defer={true} src={src} type="text/javascript" />
            <script dangerouslySetInnerHTML={{ __html }} type="text/javascript" />
        </>
    );
};
