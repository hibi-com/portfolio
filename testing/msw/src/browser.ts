import { setupWorker } from "msw/browser";
import { getAllHandlers } from "./handlers/index.js";
import { SERVICE_WORKER_PATH, UNHANDLED_REQUEST_STRATEGY } from "./lib/constants.js";

function createWorker() {
    const handlers = getAllHandlers();
    return setupWorker(...handlers);
}

function isBrowserEnvironment(): boolean {
    return "window" in globalThis;
}

const worker = createWorker();

if (isBrowserEnvironment()) {
    worker.start({
        onUnhandledRequest: UNHANDLED_REQUEST_STRATEGY,
        serviceWorker: {
            url: SERVICE_WORKER_PATH,
        },
    });
}

export { worker };
export default worker;
