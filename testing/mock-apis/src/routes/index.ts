import type { Hono } from "hono";
import { registerFreeeRoutes } from "./freee.js";
import { registerHealthRoutes } from "./health.js";

export function registerAllRoutes(app: Hono): void {
    registerHealthRoutes(app);
    registerFreeeRoutes(app);
}

export { registerFreeeRoutes } from "./freee.js";
export { registerHealthRoutes } from "./health.js";
