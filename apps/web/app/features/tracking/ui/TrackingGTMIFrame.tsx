import type { TrackingGTMIFrameProps } from "../model/types";

/**
 * @name TrackingGTMIFrame
 * @external https://tagmanager.google.com/
 * @description GTM requires a two part implementation, this noscript iframe
 * is responsible for loading GTM which loads our Tags and Pixels
 */
export const TrackingGTMIFrame = (props: TrackingGTMIFrameProps) => {
    const { id } = props;

    const src = `https://www.googletagmanager.com/ns.html?id=${id}`;

    return (
        <noscript>
            <iframe
                height="0"
                src={src}
                style={{
                    display: "none",
                    visibility: "hidden",
                }}
                title="Google Tag Manager"
                width="0"
            />
        </noscript>
    );
};
