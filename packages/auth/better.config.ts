import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { oAuthProxy } from "better-auth/plugins";

const dummyPrisma = {} as any;

export const auth = betterAuth({
    database: prismaAdapter(dummyPrisma, {
        provider: "mysql",
    }),
    baseURL: "http://localhost:3000",
    secret: "secret",
    plugins: [
        oAuthProxy({
            productionURL: "http://localhost:3000",
        }) as unknown as any,
    ],
    socialProviders: {
        google: {
            clientId: "1234567890",
            clientSecret: "1234567890",
            redirectURI: "http://localhost:3000/api/auth/callback/google",
        },
    },
} satisfies BetterAuthOptions);
