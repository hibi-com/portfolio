import { type SetupServerApi, setupServer } from "msw/node";
import { getAllHandlers } from "./handlers/index.js";
import { UNHANDLED_REQUEST_STRATEGY } from "./lib/constants.js";

function createServer(): SetupServerApi {
    const handlers = getAllHandlers();
    return setupServer(...handlers);
}

function setupSignalHandlers(server: SetupServerApi): void {
    if (typeof process === "undefined") return;

    const cleanup = () => server.close();

    process.once("SIGINT", cleanup);
    process.once("SIGTERM", cleanup);
}

const server = createServer();

if (typeof process !== "undefined") {
    server.listen({ onUnhandledRequest: UNHANDLED_REQUEST_STRATEGY });
    setupSignalHandlers(server);
}

export { server };
export default server;
