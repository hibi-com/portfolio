import type { LoaderFunction } from "@remix-run/cloudflare";
import { BASE_URL } from "~/shared/config/settings";

export const loader: LoaderFunction = () => {
    const robotText = `
User-agent: *
Disallow: /api
Sitemap: ${BASE_URL}/sitemap.xml
`;

    return new Response(robotText, {
        headers: { "Content-Type": "text/plain" },
        status: 200,
    });
};
