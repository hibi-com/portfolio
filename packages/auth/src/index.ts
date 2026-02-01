import type { D1Database } from "@cloudflare/workers-types";
import { createPrismaClient } from "@portfolio/db";
import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { oAuthProxy } from "better-auth/plugins";

export interface InitAuthOptions<TExtraPlugins extends BetterAuthPlugin[] = []> {
    baseUrl: string;
    productionUrl: string;
    secret: string | undefined;
    googleClientId: string;
    googleClientSecret: string;
    d1?: D1Database;
    databaseUrl?: string;
    extraPlugins?: TExtraPlugins;
}

export function initAuth<TExtraPlugins extends BetterAuthPlugin[] = []>(
    options: InitAuthOptions<TExtraPlugins>,
): ReturnType<typeof betterAuth> {
    const prisma = createPrismaClient({
        databaseUrl: options.databaseUrl,
    });

    const config = {
        database: prismaAdapter(prisma, {
            provider: "mysql",
        }),
        baseURL: options.baseUrl,
        secret: options.secret,
        plugins: [
            oAuthProxy({
                productionURL: options.productionUrl,
            }) as unknown as BetterAuthPlugin,
            ...(options.extraPlugins ?? []),
        ],
        socialProviders: {
            google: {
                clientId: options.googleClientId,
                clientSecret: options.googleClientSecret,
                redirectURI: `${options.productionUrl}/api/auth/callback/google`,
            },
        },
        onAPIError: {
            onError(error, ctx) {
                console.error("BETTER AUTH API ERROR", error, ctx);
            },
        },
    } satisfies BetterAuthOptions;

    return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
