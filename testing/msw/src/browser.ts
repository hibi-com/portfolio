import { setupWorker } from "msw/browser";
import { getAllHandlers } from "./handlers/index.js";
import { SERVICE_WORKER_PATH, UNHANDLED_REQUEST_STRATEGY } from "./lib/constants.js";

function createWorker() {
    const handlers = getAllHandlers();
    return setupWorker(...handlers);
}

function isBrowserEnvironment(): boolean {
    return typeof window !== "undefined" && typeof document !== "undefined";
}

const worker = isBrowserEnvironment()
    ? (() => {
          const instance = createWorker();
          void instance.start({
              onUnhandledRequest: UNHANDLED_REQUEST_STRATEGY,
              serviceWorker: {
                  url: SERVICE_WORKER_PATH,
              },
          });
          return instance;
      })()
    : (undefined as unknown as ReturnType<typeof createWorker>);

export { worker };
export default worker;
