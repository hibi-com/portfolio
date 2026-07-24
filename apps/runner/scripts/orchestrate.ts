#!/usr/bin/env bun
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import { type RunnerConfig, validateConfig } from "../src/types";

type Args = {
    config: string;
    baseUrl: string;
    token: string;
    pollMs: number;
};

function usage(): never {
    console.error("Usage: bun run orchestrate --config testing/load/stg.yaml [--base-url URL] [--token TOKEN]");
    process.exit(1);
    throw new Error("unreachable");
}

function parseArgs(argv: string[]): Args {
    let config = "";
    let baseUrl = process.env.RUNNER_BASE_URL ?? "";
    let token = process.env.RUNNER_TOKEN ?? "";
    let pollMs = 5_000;

    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];
        if (arg === "--config") {
            config = argv[++i] ?? "";
        } else if (arg === "--base-url") {
            baseUrl = argv[++i] ?? "";
        } else if (arg === "--token") {
            token = argv[++i] ?? "";
        } else if (arg === "--poll-ms") {
            pollMs = Number(argv[++i] ?? "5000");
        } else if (arg === "--help") {
            usage();
        }
    }

    if (!config || !baseUrl || !token) {
        usage();
    }

    return { config, baseUrl, token, pollMs };
}

async function main(): Promise<void> {
    const args = parseArgs(process.argv.slice(2));
    const absolute = resolve(process.cwd(), args.config);
    const raw = parse(readFileSync(absolute, "utf8")) as RunnerConfig;
    validateConfig(raw);

    const startRes = await fetch(new URL("/runs", args.baseUrl), {
        method: "POST",
        headers: {
            authorization: `Bearer ${args.token}`,
            "content-type": "application/json",
        },
        body: JSON.stringify({ config: raw }),
    });

    if (!startRes.ok) {
        console.error("failed to start run", startRes.status, await startRes.text());
        process.exit(1);
    }

    const started = (await startRes.json()) as { run: { id: string; endAt: number } };
    const runId = started.run.id;
    console.log(`started run ${runId} mode=${raw.mode}`);

    const deadline = started.run.endAt + 60_000;
    while (Date.now() < deadline) {
        await Bun.sleep(args.pollMs);
        const statusRes = await fetch(new URL(`/runs/${runId}`, args.baseUrl), {
            headers: { authorization: `Bearer ${args.token}` },
        });
        if (!statusRes.ok) {
            console.error("failed to poll run", statusRes.status, await statusRes.text());
            process.exit(1);
        }
        const body = (await statusRes.json()) as {
            run: {
                status: string;
                requests: number;
                successes: number;
                failures: number;
                findings: unknown[];
                error?: string;
                activePods: number;
            };
        };
        const run = body.run;
        console.log(
            `status=${run.status} pods=${run.activePods} req=${run.requests} ok=${run.successes} fail=${run.failures} findings=${run.findings.length}`,
        );

        if (run.status === "succeeded") {
            if (raw.mode === "load" && run.failures > 0) {
                console.error("load run reported failures");
                process.exit(1);
            }
            if (raw.mode === "dast" && run.findings.length > 0) {
                console.error(`dast findings: ${run.findings.length}`);
                console.error(JSON.stringify(run.findings, null, 2));
                process.exit(1);
            }
            console.log("run succeeded");
            process.exit(0);
        }

        if (run.status === "failed") {
            console.error(run.error ?? "run failed");
            process.exit(1);
        }
    }

    console.error("timed out waiting for run completion");
    process.exit(1);
}

await main();
