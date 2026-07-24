import { launch, type BrowserWorker } from "@cloudflare/playwright";
import { runCriticalScenarios } from "./scenarios";
import {
  type E2eRunRecord,
  type E2eRunRequest,
  validateRunRequest,
} from "./types";

export type Env = {
  BROWSER: BrowserWorker;
  RUNS: KVNamespace;
  E2E_TOKEN: string;
};

function unauthorized(): Response {
  return Response.json({ error: "unauthorized" }, { status: 401 });
}

function requireToken(request: Request, env: Env): boolean {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return Boolean(env.E2E_TOKEN) && token === env.E2E_TOKEN;
}

async function writeRun(env: Env, run: E2eRunRecord): Promise<void> {
  await env.RUNS.put(`run:${run.id}`, JSON.stringify(run), {
    expirationTtl: 60 * 60 * 24,
  });
}

async function readRun(env: Env, runId: string): Promise<E2eRunRecord | null> {
  const raw = await env.RUNS.get(`run:${runId}`, "json");
  return (raw as E2eRunRecord | null) ?? null;
}

async function executeRun(
  env: Env,
  request: E2eRunRequest,
): Promise<E2eRunRecord> {
  const run: E2eRunRecord = {
    id: crypto.randomUUID(),
    status: "running",
    webBaseUrl: request.webBaseUrl,
    apiBaseUrl: request.apiBaseUrl,
    startedAt: Date.now(),
    results: [],
  };
  await writeRun(env, run);

  const browser = await launch(env.BROWSER, {
    keep_alive: request.keepAliveMs ?? 60_000,
  });

  try {
    run.results = await runCriticalScenarios(browser, {
      webBaseUrl: request.webBaseUrl,
      apiBaseUrl: request.apiBaseUrl,
    });
    run.status = run.results.every((r) => r.ok) ? "succeeded" : "failed";
    if (run.status === "failed") {
      run.error = run.results
        .filter((r) => !r.ok)
        .map((r) => `${r.name}: ${r.error ?? "failed"}`)
        .join("; ");
    }
  } catch (error) {
    run.status = "failed";
    run.error = error instanceof Error ? error.message : String(error);
  } finally {
    await browser.close();
    run.finishedAt = Date.now();
    await writeRun(env, run);
  }

  return run;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ status: "healthy" });
    }

    if (!requireToken(request, env)) {
      return unauthorized();
    }

    if (request.method === "POST" && url.pathname === "/runs") {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return Response.json({ error: "invalid json" }, { status: 400 });
      }

      let parsed: E2eRunRequest;
      try {
        parsed = validateRunRequest(body);
      } catch (error) {
        return Response.json(
          { error: error instanceof Error ? error.message : String(error) },
          { status: 400 },
        );
      }

      const run = await executeRun(env, parsed);
      return Response.json({ run }, { status: run.status === "succeeded" ? 200 : 500 });
    }

    const match = url.pathname.match(/^\/runs\/([^/]+)$/);
    if (request.method === "GET" && match?.[1]) {
      const run = await readRun(env, match[1]);
      if (!run) {
        return Response.json({ error: "not found" }, { status: 404 });
      }
      return Response.json({ run });
    }

    return Response.json({ error: "not found" }, { status: 404 });
  },
};
