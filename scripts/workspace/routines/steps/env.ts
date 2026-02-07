#!/usr/bin/env bun

import { setupComposeSecrets } from "../lib/env";
import type { StepContext } from "../lib/types";

export async function runEnvStep(ctx: StepContext): Promise<void> {
    await setupComposeSecrets(ctx.rootDir);
}
