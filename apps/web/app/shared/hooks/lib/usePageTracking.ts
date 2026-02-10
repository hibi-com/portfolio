import { useLocation } from "@remix-run/react";
import * as React from "react";
import { BASE_URL } from "~/shared/config/settings";

export const usePageTracking = () => {
    const { pathname } = useLocation();

    React.useEffect(() => {
        const gtag = (globalThis as unknown as Window).gtag;
        if (!gtag) return;

        gtag("event", "page_view", {
            page_location: `${BASE_URL}${pathname}`,
        });
    }, [pathname]);
};
