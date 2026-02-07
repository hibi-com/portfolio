import { setupWorker } from "msw/browser";
import { restHandlers } from "./handlers/rest";

const handlers = [...restHandlers];

const worker = setupWorker(...handlers);

if ("window" in globalThis) {
    worker.start({
        onUnhandledRequest: "bypass",
        serviceWorker: {
            url: "/mockServiceWorker.js",
        },
    });
}

export { worker };
export default worker;
