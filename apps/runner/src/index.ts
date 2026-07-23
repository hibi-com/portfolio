import { nextPodPlan, runDastBatch, runLoadBatch } from "./pod";
import {
  parseDurationMs,
  type PodMessage,
  type RunRecord,
  type RunnerConfig,
  validateConfig,
} from "./types";

export type Env = {
  RUNS: KVNamespace;
  POD_QUEUE: Queue<PodMessage>;
  RUNNER_TOKEN: string;
};

function unauthorized(): Response {
  return Response.json({ error: "unauthorized" }, { status: 401 });
}

function requireToken(request: Request, env: Env): boolean {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return Boolean(env.RUNNER_TOKEN) && token === env.RUNNER_TOKEN;
}

async function readRun(env: Env, runId: string): Promise<RunRecord | null> {
  const raw = await env.RUNS.get(`run:${runId}`, "json");
  return (raw as RunRecord | null) ?? null;
}

async function writeRun(env: Env, run: RunRecord): Promise<void> {
  await env.RUNS.put(`run:${run.id}`, JSON.stringify(run), {
    expirationTtl: 60 * 60 * 24,
  });
}

async function enqueuePods(env: Env, runId: string, count: number): Promise<void> {
  for (let i = 0; i < count; i += 1) {
    const podId = crypto.randomUUID();
    await env.POD_QUEUE.send({ runId, podId });
  }
}

async function startRun(env: Env, config: RunnerConfig): Promise<RunRecord> {
  validateConfig(config);
  const now = Date.now();
  const run: RunRecord = {
    id: crypto.randomUUID(),
    mode: config.mode,
    status: "running",
    config,
    startedAt: now,
    endAt: now + parseDurationMs(config.duration),
    activePods: config.initialWorkers,
    peakParallelismReached: 0,
    requests: 0,
    successes: 0,
    failures: 0,
    findings: [],
  };
  await writeRun(env, run);
  await enqueuePods(env, run.id, config.initialWorkers);
  return run;
}

async function handlePod(env: Env, message: PodMessage): Promise<void> {
  const run = await readRun(env, message.runId);
  if (!run) return;

  if (run.status !== "running" || Date.now() >= run.endAt) {
    if (run.status === "running") {
      run.status = run.mode === "load" && run.failures > 0 ? "failed" : "succeeded";
      if (run.mode === "load" && run.failures > 0) {
        run.error = "non-2xx responses detected; load must stay on happy path";
      }
      run.activePods = Math.max(0, run.activePods - 1);
      await writeRun(env, run);
    }
    return;
  }

  const batch =
    run.mode === "load" ? await runLoadBatch(run) : await runDastBatch(run);

  run.requests += batch.requests;
  run.successes += batch.successes;
  run.failures += batch.failures;
  run.peakParallelismReached = Math.max(
    run.peakParallelismReached,
    Math.floor(run.config.peakParallelism / Math.max(1, run.activePods)),
  );

  if (run.mode === "dast") {
    const dastBatch = batch as Awaited<ReturnType<typeof runDastBatch>>;
    if (dastBatch.findings.length > 0) {
      run.findings = [...run.findings, ...dastBatch.findings].slice(0, 500);
    }
  }

  if (run.mode === "load" && run.failures > 0) {
    run.status = "failed";
    run.error = "non-2xx responses detected; load must stay on happy path";
    run.activePods = Math.max(0, run.activePods - 1);
    await writeRun(env, run);
    return;
  }

  const plan = nextPodPlan(run, Date.now());
  if (plan.spawn > 0) {
    run.activePods += plan.spawn;
    await enqueuePods(env, run.id, plan.spawn);
  }

  if (plan.keepAlive) {
    await writeRun(env, run);
    await env.POD_QUEUE.send({ runId: run.id, podId: message.podId });
    return;
  }

  run.activePods = Math.max(0, run.activePods - 1);
  if (run.activePods === 0 && run.status === "running") {
    run.status = "succeeded";
  }
  await writeRun(env, run);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ ok: true, service: "portfolio-runner" });
    }

    if (!requireToken(request, env)) {
      return unauthorized();
    }

    if (request.method === "POST" && url.pathname === "/runs") {
      const body = (await request.json()) as { config: RunnerConfig };
      try {
        const run = await startRun(env, body.config);
        return Response.json({ run }, { status: 202 });
      } catch (error) {
        return Response.json(
          { error: error instanceof Error ? error.message : "invalid config" },
          { status: 400 },
        );
      }
    }

    const runMatch = /^\/runs\/([^/]+)$/.exec(url.pathname);
    if (request.method === "GET" && runMatch) {
      const run = await readRun(env, runMatch[1]!);
      if (!run) {
        return Response.json({ error: "not found" }, { status: 404 });
      }
      return Response.json({ run });
    }

    return Response.json({ error: "not found" }, { status: 404 });
  },

  async queue(batch: MessageBatch<PodMessage>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      try {
        await handlePod(env, message.body);
        message.ack();
      } catch (error) {
        console.error("pod failed", error);
        message.retry();
      }
    }
  },
};
