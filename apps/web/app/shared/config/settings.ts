export const BASE_URL = import.meta.env.VITE_BASE_URL ?? "__undefined__";
export const GOOGLE_ANALYTICS = import.meta.env.VITE_GOOGLE_ANALYTICS ?? "__undefined__";
export const GOOGLE_TAG_MANAGER = import.meta.env.VITE_GOOGLE_TAG_MANAGER ?? "__undefined__";
export const GOOGLE_ANALYTICS_ENABLED = import.meta.env.VITE_GOOGLE_ANALYTICS_ENABLED === "true";
export const GOOGLE_TAG_MANAGER_ENABLED = import.meta.env.VITE_GOOGLE_TAG_MANAGER_ENABLED === "true";

export const XSTATE_INSPECTOR_ENABLED = import.meta.env.VITE_XSTATE_INSPECTOR_ENABLED === "true";

export const SENTRY_DSN = import.meta.env.SENTRY_DSN ?? "__undefined__";
export const SENTRY_ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT ?? "development";
export const SENTRY_TRACES_SAMPLE_RATE = import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE
    ? Number.parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE)
    : 1;
export const SENTRY_REPLAY_SAMPLE_RATE = import.meta.env.VITE_SENTRY_REPLAY_SAMPLE_RATE
    ? Number.parseFloat(import.meta.env.VITE_SENTRY_REPLAY_SAMPLE_RATE)
    : 0.1;
export const SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE = import.meta.env.VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE
    ? Number.parseFloat(import.meta.env.VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE)
    : 1;
