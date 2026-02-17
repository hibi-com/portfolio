/// <reference types="@cloudflare/workers-types/2023-07-01" />
/// <reference types="vite/client" />

declare global {
    interface ImportMetaEnv {
        readonly VITE_API_URL?: string;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }

    interface Window {
        gtag?: (
            command: "config" | "event" | "set" | "js",
            targetId: string | Date,
            config?: Record<string, unknown>,
        ) => void;
        dataLayer?: unknown[];
    }
}

export {};
