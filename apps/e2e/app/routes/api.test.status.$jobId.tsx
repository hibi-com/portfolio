import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { TestRunnerService } from "~/lib/test-runner/service.server";
import type { TestStatusResponse } from "~/lib/test-runner/types";

export async function loader({ params }: LoaderFunctionArgs) {
    const { jobId } = params;

    if (!jobId) {
        return json({ error: "Job ID is required" }, { status: 400 });
    }

    const job = TestRunnerService.getJob(jobId);

    if (!job) {
        return json({ error: "Job not found" }, { status: 404 });
    }

    const response: TestStatusResponse = {
        job,
    };

    return json(response);
}
