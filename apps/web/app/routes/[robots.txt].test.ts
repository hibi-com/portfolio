import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { loader } from "./[robots.txt]";

describe("[robots.txt] loader", () => {
    test("should generate robots.txt", async () => {
        const args = {} as LoaderFunctionArgs;
        const result = await loader(args);

        expect(result).toBeInstanceOf(Response);
        if (result instanceof Response) {
            const text = await result.text();
            expect(text).toContain("User-agent: *");
            expect(text).toContain("Disallow: /api");
            expect(text).toContain("Sitemap:");
        }
    });

    test("should set correct Content-Type header", async () => {
        const args = {} as LoaderFunctionArgs;
        const result = await loader(args);

        if (result instanceof Response) {
            expect(result.headers.get("Content-Type")).toBe("text/plain");
        }
    });

    test("should return 200 status", async () => {
        const args = {} as LoaderFunctionArgs;
        const result = await loader(args);

        if (result instanceof Response) {
            expect(result.status).toBe(200);
        }
    });

    test("should include sitemap URL", async () => {
        const args = {} as LoaderFunctionArgs;
        const result = await loader(args);
        if (result instanceof Response) {
            const text = await result.text();
            expect(text).toContain("/sitemap.xml");
        }
    });
});
