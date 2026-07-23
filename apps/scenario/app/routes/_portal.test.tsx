import type { MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { TestRunnerService } from "~/lib/test-runner/service.server";
import type {
    TestJob,
    TestProject,
    TestRunRequest,
    TestRunResponse,
    TestStatusResponse,
} from "~/lib/test-runner/types";

async function fetchJobUpdates(runningJobs: TestJob[]): Promise<TestJob[]> {
    return Promise.all(
        runningJobs.map(async (job) => {
            try {
                const response = await fetch(`/api/test/status/${job.id}`);
                const data: TestStatusResponse = await response.json();
                return data.job;
            } catch {
                return job;
            }
        }),
    );
}

function mergeJobUpdates(prevJobs: TestJob[], updates: TestJob[]): TestJob[] {
    const updatedJobs = [...prevJobs];
    for (const update of updates) {
        const index = updatedJobs.findIndex((j) => j.id === update.id);
        if (index !== -1) {
            updatedJobs[index] = update;
        }
    }
    return updatedJobs;
}

export const meta: MetaFunction = () => {
    return [{ title: "Test Runner - Test Portal" }];
};

export async function loader() {
    const jobs = TestRunnerService.getAllJobs();
    return { jobs };
}

export default function TestRunner() {
    const { jobs: initialJobs } = useLoaderData<typeof loader>();
    const [jobs, setJobs] = useState<TestJob[]>(initialJobs);
    const [selectedProject, setSelectedProject] = useState<TestProject>("web");
    const [selectedEnvironment, setSelectedEnvironment] = useState<"local" | "rc" | "stg" | "prd">("local");
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        const runningJobs = jobs.filter((job) => job.status === "running" || job.status === "pending");

        if (runningJobs.length === 0) return;

        const interval = setInterval(async () => {
            const updates = await fetchJobUpdates(runningJobs);
            setJobs((prevJobs) => mergeJobUpdates(prevJobs, updates));
        }, 2000);

        return () => clearInterval(interval);
    }, [jobs]);

    const handleRunTest = async () => {
        setIsRunning(true);
        try {
            const request: TestRunRequest = {
                project: selectedProject,
                environment: selectedEnvironment,
            };

            const response = await fetch("/api/test/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error("Failed to start test");
            }

            const data: TestRunResponse = await response.json();

            const newJob: TestJob = {
                id: data.jobId,
                project: selectedProject,
                status: data.status,
                startedAt: new Date().toISOString(),
            };

            setJobs([newJob, ...jobs]);
        } catch (error) {
            console.error("Failed to run test:", error);
            alert("テストの実行に失敗しました");
        } finally {
            setIsRunning(false);
        }
    };

    const getStatusBadge = (status: TestJob["status"]) => {
        const badges = {
            pending: "bg-gray-500",
            running: "bg-blue-500 animate-pulse",
            success: "bg-green-500",
            failed: "bg-red-500",
        };
        return badges[status];
    };

    const getStatusText = (status: TestJob["status"]) => {
        const texts = {
            pending: "待機中",
            running: "実行中",
            success: "成功",
            failed: "失敗",
        };
        return texts[status];
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="mb-6 font-bold text-3xl">E2E Test Runner</h1>

            <div className="mb-6 p-6 rounded-lg bg-white shadow">
                <h2 className="mb-4 font-semibold text-xl">新規テスト実行</h2>
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <label htmlFor="project" className="block mb-2 font-medium text-gray-700 text-sm">
                            プロジェクト
                        </label>
                        <select
                            id="project"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value as TestProject)}
                            className="rounded-md border border-gray-300 w-full px-3 py-2"
                            disabled={isRunning}
                        >
                            <option value="web">Web</option>
                            <option value="admin">Admin</option>
                            <option value="api">API</option>
                            <option value="portal">Portal</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="environment" className="block mb-2 font-medium text-gray-700 text-sm">
                            環境
                        </label>
                        <select
                            id="environment"
                            value={selectedEnvironment}
                            onChange={(e) => setSelectedEnvironment(e.target.value as "local" | "rc" | "stg" | "prd")}
                            className="rounded-md border border-gray-300 w-full px-3 py-2"
                            disabled={isRunning}
                        >
                            <option value="local">Local</option>
                            <option value="rc">RC</option>
                            <option value="stg">STG</option>
                            <option value="prd">PRD</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={handleRunTest}
                            disabled={isRunning}
                            className="rounded-md bg-blue-600 w-full px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isRunning ? "実行中..." : "テスト実行"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="rounded-lg bg-white shadow">
                <div className="border-b py-4 px-6">
                    <h2 className="font-semibold text-xl">実行履歴</h2>
                </div>
                <div className="divide-y">
                    {jobs.length === 0 ? (
                        <div className="px-6 py-8 text-center text-gray-500">まだテストが実行されていません</div>
                    ) : (
                        jobs.map((job) => (
                            <div key={job.id} className="px-6 py-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-lg">{job.project}</span>
                                        <span
                                            className={`rounded-full px-3 py-1 text-sm text-white ${getStatusBadge(job.status)}`}
                                        >
                                            {getStatusText(job.status)}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(job.startedAt).toLocaleString("ja-JP")}
                                    </div>
                                </div>
                                {job.completedAt && (
                                    <div className="mb-2 text-sm text-gray-600">
                                        完了時刻: {new Date(job.completedAt).toLocaleString("ja-JP")}
                                    </div>
                                )}
                                {job.error && (
                                    <div className="mt-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                                        <strong>エラー:</strong> {job.error}
                                    </div>
                                )}
                                {job.reportPath && job.status === "success" && (
                                    <div className="mt-2">
                                        <a
                                            href={job.reportPath}
                                            className="text-sm text-blue-600 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            レポートを見る →
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
