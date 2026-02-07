#!/usr/bin/env bun

import { logStep } from "../lib/env";
import type { StepContext } from "../lib/types";

export async function runEnvStep(_ctx: StepContext): Promise<void> {
    logStep("", "環境変数は compose または Cloudflare で管理します", "info");
}
