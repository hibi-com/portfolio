export type E2eRunRequest = {
    webBaseUrl: string;
    apiBaseUrl: string;
    keepAliveMs?: number;
};

export type ScenarioResult = {
    name: string;
    ok: boolean;
    durationMs: number;
    error?: string;
};

export type E2eRunRecord = {
    id: string;
    status: "running" | "succeeded" | "failed";
    webBaseUrl: string;
    apiBaseUrl: string;
    startedAt: number;
    finishedAt?: number;
    results: ScenarioResult[];
    error?: string;
};

export function validateRunRequest(body: unknown): E2eRunRequest {
    if (!body || typeof body !== "object") {
        throw new Error("request body must be an object");
    }
    const raw = body as Record<string, unknown>;
    const webBaseUrl = raw.webBaseUrl;
    const apiBaseUrl = raw.apiBaseUrl;
    if (typeof webBaseUrl !== "string" || !webBaseUrl.startsWith("http")) {
        throw new Error("webBaseUrl must be an absolute http(s) URL");
    }
    if (typeof apiBaseUrl !== "string" || !apiBaseUrl.startsWith("http")) {
        throw new Error("apiBaseUrl must be an absolute http(s) URL");
    }
    const keepAliveMs =
        typeof raw.keepAliveMs === "number" && raw.keepAliveMs > 0 ? Math.min(raw.keepAliveMs, 600_000) : undefined;
    return {
        webBaseUrl: webBaseUrl.replace(/\/$/, ""),
        apiBaseUrl: apiBaseUrl.replace(/\/$/, ""),
        keepAliveMs,
    };
}
