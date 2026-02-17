import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import type { TestJob, TestProject, TestRunRequest } from "./types";

const jobs = new Map<string, TestJob>();

const PROJECT_PATHS: Record<TestProject, string> = {
    web: "../web",
    admin: "../admin",
    api: "../api",
    portal: ".",
};

export class TestRunnerService {
    static async runTest(request: TestRunRequest): Promise<TestJob> {
        const jobId = randomUUID();
        const job: TestJob = {
            id: jobId,
            project: request.project,
            status: "pending",
            startedAt: new Date().toISOString(),
        };

        jobs.set(jobId, job);

        this.executeTest(jobId, request).catch((error) => {
            console.error(`Test execution failed for job ${jobId}:`, error);
            const failedJob = jobs.get(jobId);
            if (failedJob) {
                failedJob.status = "failed";
                failedJob.error = error.message;
                failedJob.completedAt = new Date().toISOString();
                jobs.set(jobId, failedJob);
            }
        });

        return job;
    }

    static getJob(jobId: string): TestJob | undefined {
        return jobs.get(jobId);
    }

    static getAllJobs(): TestJob[] {
        return Array.from(jobs.values()).sort((a, b) => {
            return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
        });
    }

    private static async executeTest(jobId: string, request: TestRunRequest): Promise<void> {
        const job = jobs.get(jobId);
        if (!job) {
            throw new Error(`Job ${jobId} not found`);
        }

        job.status = "running";
        jobs.set(jobId, job);

        const projectPath = PROJECT_PATHS[request.project];
        const environment = request.environment || "local";

        const env: NodeJS.ProcessEnv = {
            ...process.env,
            NODE_ENV: environment === "local" ? "development" : "production",
            STORAGE_TYPE: environment === "local" ? "local" : "s3",
        };

        if (environment !== "local") {
            const baseUrls: Record<string, Record<TestProject, string>> = {
                rc: {
                    web: "https://rc-web.ageha734.jp",
                    admin: "https://rc-admin.ageha734.jp",
                    api: "https://rc-api.ageha734.jp",
                    portal: "https://rc-portal.ageha734.jp",
                },
                stg: {
                    web: "https://stg-web.ageha734.jp",
                    admin: "https://stg-admin.ageha734.jp",
                    api: "https://stg-api.ageha734.jp",
                    portal: "https://stg-portal.ageha734.jp",
                },
                prd: {
                    web: "https://www.ageha734.jp",
                    admin: "https://admin.ageha734.jp",
                    api: "https://api.ageha734.jp",
                    portal: "https://portal.ageha734.jp",
                },
            };

            env.BASE_URL = baseUrls[environment]?.[request.project] || "";
        }

        return new Promise((resolve, reject) => {
            const child = spawn("bun", ["run", "test:e2e"], {
                cwd: projectPath,
                env,
                shell: true,
            });

            let output = "";
            let errorOutput = "";

            child.stdout.on("data", (data: Buffer) => {
                output += data.toString();
            });

            child.stderr.on("data", (data: Buffer) => {
                errorOutput += data.toString();
            });

            child.on("close", (code) => {
                const currentJob = jobs.get(jobId);
                if (!currentJob) return;

                currentJob.output = output;
                currentJob.completedAt = new Date().toISOString();

                if (code === 0) {
                    currentJob.status = "success";
                    currentJob.reportPath = `/reports/e2e/${request.project}`;
                } else {
                    currentJob.status = "failed";
                    currentJob.error = errorOutput || `Test exited with code ${code}`;
                }

                jobs.set(jobId, currentJob);

                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Test failed with code ${code}`));
                }
            });

            child.on("error", (error) => {
                const currentJob = jobs.get(jobId);
                if (!currentJob) return;

                currentJob.status = "failed";
                currentJob.error = error.message;
                currentJob.completedAt = new Date().toISOString();
                jobs.set(jobId, currentJob);

                reject(error);
            });
        });
    }

    static cleanupOldJobs(): void {
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

        for (const [jobId, job] of jobs.entries()) {
            if (job.completedAt) {
                const completedTime = new Date(job.completedAt).getTime();
                if (completedTime < oneDayAgo) {
                    jobs.delete(jobId);
                }
            }
        }
    }
}

if (typeof setInterval !== "undefined") {
    setInterval(
        () => {
            TestRunnerService.cleanupOldJobs();
        },
        60 * 60 * 1000,
    );
}
