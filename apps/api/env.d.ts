/// <reference types="@cloudflare/workers-types" />

declare global {
    interface ImportMetaEnv {
        readonly NODE_ENV: "development" | "production";
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

export {}
