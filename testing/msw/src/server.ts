import { type SetupServerApi, setupServer } from "msw/node";
import { restHandlers } from "./handlers/rest";

const handlers = [...restHandlers];

const server: SetupServerApi = setupServer(...handlers);

if (typeof process !== "undefined") {
    server.listen({ onUnhandledRequest: "bypass" });

    process.once("SIGINT", () => {
        server.close();
    });

    process.once("SIGTERM", () => {
        server.close();
    });
}

export default server;
