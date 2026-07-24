import type { DastFinding, LoadScenario, RunnerConfig, RunRecord, ScenarioStep } from "./types";
import { assertStgUrl, normalizeScenarios } from "./types";
import { buildProbes } from "./probes";

const BATCH_MS = 12_000;

function desiredPods(run: RunRecord, now: number): number {
    const { initialWorkers, maxWorkers, rampParallelismPerSec } = run.config;
    if (rampParallelismPerSec <= 0) {
        return Math.min(maxWorkers, Math.max(initialWorkers, run.activePods || initialWorkers));
    }
    const elapsedSec = Math.max(0, (now - run.startedAt) / 1000);
    const ramped = initialWorkers + Math.floor(elapsedSec * rampParallelismPerSec);
    return Math.min(maxWorkers, Math.max(initialWorkers, ramped));
}

function concurrencyForPod(run: RunRecord): number {
    const pods = Math.max(1, run.activePods);
    return Math.max(1, Math.floor(run.config.peakParallelism / pods));
}

function pickScenario(scenarios: LoadScenario[]): LoadScenario {
    const total = scenarios.reduce((sum, s) => sum + (s.weight ?? 1), 0);
    let cursor = Math.random() * total;
    for (const scenario of scenarios) {
        cursor -= scenario.weight ?? 1;
        if (cursor <= 0) return scenario;
    }
    return scenarios[scenarios.length - 1]!;
}

function applyVars(input: string, vars: Record<string, string>): string {
    return input.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => {
        const value = vars[key];
        if (value === undefined) {
            throw new Error(`missing scenario variable: ${key}`);
        }
        return encodeURIComponent(value);
    });
}

function readJsonPath(data: unknown, path: string): unknown {
    const parts = path.split(".").filter(Boolean);
    let current: unknown = data;
    for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        if (Array.isArray(current)) {
            const index = Number(part);
            if (!Number.isInteger(index)) return undefined;
            current = current[index];
            continue;
        }
        if (typeof current === "object") {
            current = (current as Record<string, unknown>)[part];
            continue;
        }
        return undefined;
    }
    return current;
}

async function runStep(step: ScenarioStep, vars: Record<string, string>): Promise<{ ok: boolean; status: number }> {
    const url = applyVars(step.url, vars);
    assertStgUrl(url);

    const headers: Record<string, string> = { ...(step.headers ?? {}) };
    let body: string | undefined;
    if (step.body !== undefined && step.method !== "GET" && step.method !== "HEAD") {
        const raw = typeof step.body === "string" ? applyVars(step.body, vars) : JSON.stringify(step.body);
        body = raw.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => {
            const value = vars[key];
            if (value === undefined) throw new Error(`missing scenario variable: ${key}`);
            return value;
        });
        headers["content-type"] ??= "application/json";
    }

    const res = await fetch(url, {
        method: step.method,
        headers,
        body,
        redirect: "follow",
    });

    if (step.capture?.length) {
        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
            return { ok: false, status: res.status };
        }
        const json = (await res.clone().json()) as unknown;
        for (const capture of step.capture) {
            const value = readJsonPath(json, capture.path);
            if (value === undefined || value === null) {
                return { ok: false, status: res.status };
            }
            vars[capture.as] = String(value);
        }
    }

    return { ok: res.status === step.expectStatus, status: res.status };
}

/** 1 シナリオを最初から最後まで実行。途中失敗で false */
async function runScenario(scenario: LoadScenario): Promise<{
    requests: number;
    successes: number;
    failures: number;
}> {
    const vars: Record<string, string> = {};
    let requests = 0;
    let successes = 0;
    let failures = 0;

    for (const step of scenario.steps) {
        requests += 1;
        try {
            const result = await runStep(step, vars);
            if (result.ok) successes += 1;
            else {
                failures += 1;
                break;
            }
        } catch {
            failures += 1;
            break;
        }
    }

    return { requests, successes, failures };
}

export async function runLoadBatch(run: RunRecord): Promise<{
    requests: number;
    successes: number;
    failures: number;
}> {
    const scenarios = normalizeScenarios(run.config);
    if (scenarios.length === 0) {
        return { requests: 0, successes: 0, failures: 0 };
    }

    const concurrency = concurrencyForPod(run);
    const opsLimit = run.config.opsPerWorker;
    const started = Date.now();
    let requests = 0;
    let successes = 0;
    let failures = 0;

    while (Date.now() - started < BATCH_MS && Date.now() < run.endAt) {
        // OPS は「シナリオ完了数」ではなくリクエスト数でカウント
        if (opsLimit > 0 && requests >= opsLimit * (BATCH_MS / 1000)) {
            break;
        }

        const batch = Array.from({ length: concurrency }, () => runScenario(pickScenario(scenarios)));
        const results = await Promise.all(batch);

        for (const result of results) {
            requests += result.requests;
            successes += result.successes;
            failures += result.failures;
        }

        if (failures > 0) {
            break;
        }
    }

    return { requests, successes, failures };
}

export async function runDastBatch(run: RunRecord): Promise<{
    requests: number;
    successes: number;
    failures: number;
    findings: DastFinding[];
}> {
    const targets = run.config.targets ?? [];
    const probes = buildProbes(run.config.categories ?? ["sqli", "xss", "path-traversal", "header-injection"]);
    const findings: DastFinding[] = [];
    let requests = 0;
    let successes = 0;
    let failures = 0;
    const concurrency = concurrencyForPod(run);
    const started = Date.now();
    let index = 0;

    const jobs = targets.flatMap((target) =>
        probes.map((probe) => ({
            target,
            probe,
        })),
    );

    while (Date.now() - started < BATCH_MS && Date.now() < run.endAt && index < jobs.length) {
        const slice = jobs.slice(index, index + concurrency);
        index += slice.length;

        const results = await Promise.all(
            slice.map(async ({ target, probe }) => {
                const url = probe.buildUrl(target);
                try {
                    const res = await fetch(url, {
                        method: "GET",
                        headers: probe.headers,
                        redirect: "manual",
                    });
                    const body = await res.text();
                    const detail = probe.suspicious(res.status, body);
                    return {
                        ok: true,
                        finding: detail
                            ? {
                                  category: probe.category,
                                  target: url,
                                  payload: url,
                                  status: res.status,
                                  detail,
                              }
                            : null,
                    };
                } catch (error) {
                    return {
                        ok: false,
                        finding: {
                            category: probe.category,
                            target: url,
                            payload: url,
                            status: 0,
                            detail: error instanceof Error ? error.message : "request failed",
                        } satisfies DastFinding,
                    };
                }
            }),
        );

        for (const result of results) {
            requests += 1;
            if (result.ok) successes += 1;
            else failures += 1;
            if (result.finding) findings.push(result.finding);
        }
    }

    return { requests, successes, failures, findings };
}

export function nextPodPlan(run: RunRecord, now: number): { keepAlive: boolean; spawn: number } {
    if (now >= run.endAt || run.status !== "running") {
        return { keepAlive: false, spawn: 0 };
    }
    if (run.mode === "load" && run.failures > 0) {
        return { keepAlive: false, spawn: 0 };
    }
    const want = desiredPods(run, now);
    const spawn = Math.max(0, want - run.activePods);
    return { keepAlive: true, spawn };
}

export type { RunnerConfig };
