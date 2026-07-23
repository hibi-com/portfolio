import type { DastFinding, LoadEndpoint, RunnerConfig, RunRecord } from "./types";
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

async function hitLoadEndpoint(endpoint: LoadEndpoint): Promise<boolean> {
  const res = await fetch(endpoint.url, {
    method: endpoint.method,
    redirect: "follow",
  });
  return res.status === endpoint.expectStatus;
}

export async function runLoadBatch(run: RunRecord): Promise<{
  requests: number;
  successes: number;
  failures: number;
}> {
  const endpoints = run.config.endpoints ?? [];
  if (endpoints.length === 0) {
    return { requests: 0, successes: 0, failures: 0 };
  }

  const concurrency = concurrencyForPod(run);
  const opsLimit = run.config.opsPerWorker;
  const started = Date.now();
  let requests = 0;
  let successes = 0;
  let failures = 0;
  let cursor = 0;

  while (Date.now() - started < BATCH_MS && Date.now() < run.endAt) {
    if (opsLimit > 0 && requests >= opsLimit * (BATCH_MS / 1000)) {
      break;
    }

    const batch = Array.from({ length: concurrency }, () => {
      const endpoint = endpoints[cursor % endpoints.length]!;
      cursor += 1;
      return hitLoadEndpoint(endpoint);
    });

    const results = await Promise.all(batch);
    requests += results.length;
    for (const ok of results) {
      if (ok) successes += 1;
      else failures += 1;
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
