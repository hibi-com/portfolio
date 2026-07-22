import { DIContainer } from "~/di/container";
import type { Env } from "~/env";

/** Create a DIContainer from Worker env bindings. */
export function createContainer(env: Env): DIContainer {
    return new DIContainer(
        env.DB,
        env.CACHE,
        env.IMAGES,
        env.R2_PUBLIC_URL,
        env.FREEE_AUTH_BASE_URL,
        env.FREEE_API_BASE_URL,
        env.DATABASE_URL,
    );
}
