export type RunMode = "load" | "dast";

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
    if (!config.endpoints?.length) {
      throw new Error("load mode requires endpoints");
    }
    for (const endpoint of config.endpoints) {
      assertStgUrl(endpoint.url);
      if (endpoint.method !== "GET" && endpoint.method !== "HEAD") {
        throw new Error("load endpoints must be GET/HEAD (happy path only)");
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
