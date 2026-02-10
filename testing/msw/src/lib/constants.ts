export const DEFAULT_API_URL = "http://localhost:8787";
export const API_URL = process.env.API_URL || DEFAULT_API_URL;
export const SERVICE_WORKER_PATH = "/mockServiceWorker.js";
export const UNHANDLED_REQUEST_STRATEGY = "bypass" as const;
