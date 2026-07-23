export type TestProject = "web" | "admin" | "api" | "portal";

export type TestStatus = "pending" | "running" | "success" | "failed";

export interface TestJob {
    id: string;
    project: TestProject;
    status: TestStatus;
    startedAt: string;
    completedAt?: string;
    output?: string;
    error?: string;
    reportPath?: string;
}

export interface TestRunRequest {
    project: TestProject;
    environment?: "local" | "rc" | "stg" | "prd";
}

export interface TestRunResponse {
    jobId: string;
    status: TestStatus;
    message: string;
}

export interface TestStatusResponse {
    job: TestJob;
}
