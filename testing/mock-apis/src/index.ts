import { serve } from "bun";
import { Hono } from "hono";
import { DEFAULT_HOSTNAME, DEFAULT_PORT } from "./lib/constants.js";
import { registerAllRoutes } from "./routes/index.js";

const app = new Hono();

registerAllRoutes(app);

const port = Number(process.env.PORT) || DEFAULT_PORT;
const hostname = process.env.HOSTNAME || DEFAULT_HOSTNAME;

serve({
    port,
    hostname,
    fetch: app.fetch,
});

console.log(`[mock-apis] listening on http://${hostname}:${port}`);
