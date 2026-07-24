export type RunMode = "load" | "dast";

export type HttpMethod = "GET" | "HEAD" | "POST" | "PUT";

/** ステップ間で値を引き継ぐための簡易キャプチャ（JSON のドットパス） */
export type StepCapture = {
    from: "json";
    /** 例: data.0.id / items.0.slug */
    path: string;
    as: string;
};

export type ScenarioStep = {
    name: string;
    method: HttpMethod;
    /** {{var}} を前ステップの capture で置換可能 */
    url: string;
    headers?: Record<string, string>;
    /** JSON 文字列またはオブジェクト。{{var}} 置換可 */
    body?: string | Record<string, unknown>;
    expectStatus: number;
    capture?: StepCapture[];
};

export type LoadScenario = {
    name: string;
    /** 選択重み（省略時 1） */
    weight?: number;
    steps: ScenarioStep[];
};

/** @deprecated scenarios へ移行。単発 endpoint 互換用 */
export type LoadEndpoint = {
    method: "GET" | "HEAD";
    url: string;
    expectStatus: number;
};

export type RunnerConfig = {
    target: "stg";
    mode: RunMode;
    peakParallelism: number;
    opsPerWorker: number;
    initialWorkers: number;
    maxWorkers: number;
    rampParallelismPerSec: number;
    duration: string;
    /** 負荷試験シナリオ（正常系マルチステップ） */
    scenarios?: LoadScenario[];
    /** @deprecated scenarios を使う */
    endpoints?: LoadEndpoint[];
    targets?: string[];
    categories?: string[];
};

export type RunRecord = {
    id: string;
    mode: RunMode;
    status: "running" | "succeeded" | "failed";
    config: RunnerConfig;
    startedAt: number;
    endAt: number;
    activePods: number;
    peakParallelismReached: number;
    requests: number;
    successes: number;
    failures: number;
    findings: DastFinding[];
    error?: string;
};

export type DastFinding = {
    category: string;
    target: string;
    payload: string;
    status: number;
    detail: string;
};

export type PodMessage = {
    runId: string;
    podId: string;
};

export const STG_HOST_RE = /^stg\.(www|api)\.ageha734\.jp$/i;

export function parseDurationMs(duration: string): number {
    const match = /^(\d+)(ms|s|m|h)$/.exec(duration.trim());
    if (!match) {
        throw new Error(`Invalid duration: ${duration}`);
    }
    const value = Number(match[1]);
    switch (match[2]) {
        case "ms":
            return value;
        case "s":
            return value * 1000;
        case "m":
            return value * 60_000;
        case "h":
            return value * 3_600_000;
        default:
            throw new Error(`Invalid duration unit: ${duration}`);
    }
}

export function assertStgUrl(url: string): void {
    let host: string;
    try {
        host = new URL(url).hostname;
    } catch {
        throw new Error(`Invalid URL: ${url}`);
    }
    if (!STG_HOST_RE.test(host)) {
        throw new Error(`STG only. Refusing host: ${host}`);
    }
}

export function normalizeScenarios(config: RunnerConfig): LoadScenario[] {
    if (config.scenarios?.length) {
        return config.scenarios;
    }
    if (config.endpoints?.length) {
        return [
            {
                name: "legacy-endpoints",
                weight: 1,
                steps: config.endpoints.map((endpoint, index) => ({
                    name: `step-${index + 1}`,
                    method: endpoint.method,
                    url: endpoint.url,
                    expectStatus: endpoint.expectStatus,
                })),
            },
        ];
    }
    return [];
}

function assertHappyStatus(status: number): void {
    if (status < 200 || status > 299) {
        throw new Error(`expectStatus must be 2xx for load scenarios, got ${status}`);
    }
}

export function validateConfig(config: RunnerConfig): void {
    if (config.target !== "stg") {
        throw new Error("target must be stg");
    }
    if (config.initialWorkers < 1) {
        throw new Error("initialWorkers must be >= 1");
    }
    if (config.maxWorkers < config.initialWorkers || config.maxWorkers > 300) {
        throw new Error("maxWorkers must be between initialWorkers and 300");
    }
    if (config.peakParallelism < 1) {
        throw new Error("peakParallelism must be >= 1");
    }
    if (config.mode === "load") {
        const scenarios = normalizeScenarios(config);
        if (scenarios.length === 0) {
            throw new Error("load mode requires scenarios (or legacy endpoints)");
        }
        for (const scenario of scenarios) {
            if (!scenario.name || !scenario.steps?.length) {
                throw new Error(`scenario "${scenario.name ?? "?"}" needs steps`);
            }
            for (const step of scenario.steps) {
                assertHappyStatus(step.expectStatus);
                // テンプレ URL は実行時に解決するため、プレースホルダ無しのものだけ事前検証
                if (!step.url.includes("{{")) {
                    assertStgUrl(step.url);
                }
            }
        }
    }
    if (config.mode === "dast") {
        if (!config.targets?.length) {
            throw new Error("dast mode requires targets");
        }
        for (const target of config.targets) {
            assertStgUrl(target);
        }
    }
}
