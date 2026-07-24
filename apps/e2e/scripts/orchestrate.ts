#!/usr/bin/env bun

type Args = {
  webBaseUrl: string;
  apiBaseUrl: string;
  baseUrl: string;
  token: string;
};

function usage(): never {
  console.error(
    "Usage: bun run orchestrate -- --web-base-url URL --api-base-url URL [--base-url E2E_WORKER_URL] [--token TOKEN]",
  );
  process.exit(1);
  throw new Error("unreachable");
}

function parseArgs(argv: string[]): Args {
  let webBaseUrl = process.env.E2E_WEB_BASE_URL ?? "";
  let apiBaseUrl = process.env.E2E_API_BASE_URL ?? "";
  let baseUrl = process.env.E2E_BASE_URL ?? "";
  let token = process.env.E2E_TOKEN ?? "";

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--web-base-url") {
      webBaseUrl = argv[++i] ?? "";
    } else if (arg === "--api-base-url") {
      apiBaseUrl = argv[++i] ?? "";
    } else if (arg === "--base-url") {
      baseUrl = argv[++i] ?? "";
    } else if (arg === "--token") {
      token = argv[++i] ?? "";
    } else if (arg === "--help") {
      usage();
    }
  }

  if (!webBaseUrl || !apiBaseUrl || !baseUrl || !token) {
    usage();
  }

  return { webBaseUrl, apiBaseUrl, baseUrl, token };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  const res = await fetch(new URL("/runs", args.baseUrl), {
    method: "POST",
    headers: {
      authorization: `Bearer ${args.token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      webBaseUrl: args.webBaseUrl,
      apiBaseUrl: args.apiBaseUrl,
    }),
  });

  const text = await res.text();
  let body: {
    run?: {
      id: string;
      status: string;
      results: Array<{ name: string; ok: boolean; error?: string; durationMs: number }>;
      error?: string;
    };
    error?: string;
  };
  try {
    body = JSON.parse(text) as typeof body;
  } catch {
    console.error("invalid response", res.status, text);
    process.exit(1);
  }

  if (!body.run) {
    console.error("failed to start e2e", res.status, body.error ?? text);
    process.exit(1);
  }

  const run = body.run;
  console.log(`run ${run.id} status=${run.status}`);
  for (const result of run.results) {
    const mark = result.ok ? "ok" : "FAIL";
    console.log(
      `  [${mark}] ${result.name} (${result.durationMs}ms)${result.error ? ` — ${result.error}` : ""}`,
    );
  }

  if (run.status !== "succeeded" || !res.ok) {
    console.error(run.error ?? "e2e failed");
    process.exit(1);
  }
}

await main();
