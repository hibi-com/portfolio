import type { LoaderFunction } from "@remix-run/cloudflare";
import type { Post } from "~/entities/blog";
import type { Portfolio } from "~/entities/portfolio";
import { SITE_UPDATED } from "~/shared/config/constants";
import { BASE_URL } from "~/shared/config/settings";
import { createApiClient } from "~/shared/lib/api";

export const loader: LoaderFunction = async (args) => {
    const apiUrl =
        args.context.cloudflare && typeof args.context.cloudflare === "object" && "env" in args.context.cloudflare
            ? (args.context.cloudflare.env as { VITE_API_URL?: string })?.VITE_API_URL
            : undefined;
    const api = createApiClient(apiUrl);

    const [portfoliosResponse, postsResponse] = await Promise.all([
        api.portfolios.listPortfolios(),
        api.posts.listPosts(),
    ]);
    const portfolios = Array.isArray(portfoliosResponse.data) ? portfoliosResponse.data : portfoliosResponse.data.data;
    const posts = Array.isArray(postsResponse.data) ? postsResponse.data : postsResponse.data.data;

    const routes = ["/blog", "/portfolio", "/resume", "/uses"];

    const links = routes.map(
        (path: string) => `  <url>
    <changefreq>monthly</changefreq>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${SITE_UPDATED.toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>`,
    );

    const blog = posts.map(
        (p: Post) => `  <url>
    <changefreq>monthly</changefreq>
    <loc>${BASE_URL}/blog/${p.slug}</loc>
    <lastmod>${new Date(p.date).toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>`,
    );

    const portfolio = portfolios.map(
        (p: Portfolio) => `  <url>
    <changefreq>monthly</changefreq>
    <loc>${BASE_URL}/portfolio/${p.slug}</loc>
    <lastmod>${new Date(p.date).toISOString()}</lastmod>
    <priority>0.9</priority>
  </url>`,
    );

    const content = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <changefreq>monthly</changefreq>
    <loc>${BASE_URL}</loc>
    <lastmod>${SITE_UPDATED.toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
  ${links.join("\n")}
  ${portfolio.join("\n")}
  ${blog.join("\n")}
</urlset>`;

    return new Response(content, {
        headers: {
            "Content-Type": "application/xml",
            "xml-version": "1.0",
            encoding: "UTF-8",
        },
        status: 200,
    });
};
