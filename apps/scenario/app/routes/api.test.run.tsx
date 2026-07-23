import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { TestRunnerService } from "~/lib/test-runner/service.server";
import type { TestRunRequest, TestRunResponse } from "~/lib/test-runner/types";

function jsonResponse(data: object, status: number) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed" }, 405);
    }

    try {
        const body: TestRunRequest = await request.json();

        if (!body.project || !["web", "admin", "api", "portal"].includes(body.project)) {
            return jsonResponse({ error: "Invalid project specified" }, 400);
        }

        if (body.environment && !["local", "rc", "stg", "prd"].includes(body.environment)) {
            return jsonResponse({ error: "Invalid environment specified" }, 400);
        }

        const job = await TestRunnerService.runTest(body);

        const response: TestRunResponse = {
            jobId: job.id,
            status: job.status,
            message: `Test execution started for ${body.project}`,
        };

        return response;
    } catch (error) {
        console.error("Test run error:", error);
        return jsonResponse(
            {
                error: error instanceof Error ? error.message : "Failed to start test execution",
            },
            500,
        );
    }
}
