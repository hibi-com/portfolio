import type { HttpHandler } from "msw";
import { restHandlers } from "./rest.js";

export { restHandlers } from "./rest.js";

export function getAllHandlers(): HttpHandler[] {
    return [...restHandlers];
}
