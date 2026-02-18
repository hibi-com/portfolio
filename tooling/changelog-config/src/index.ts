import { getInfo, getInfoFromPullRequest } from "@changesets/get-github-info";
import type { ChangelogFunctions } from "@changesets/types";

const REPO_ERROR_MESSAGE =
    'リポジトリ情報を指定してください:\n"changelog": ["@portfolio/changelog-config", { "repo": "org/repo" }]';

function parsePrFromFirstLine(firstLine: string): { replacedLine: string; prNumber?: number } {
    let prNumber: number | undefined;
    const replacedLine = firstLine.replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/i, (_, pr) => {
        const num = Number.parseInt(pr, 10);
        if (!Number.isNaN(num)) prNumber = num;
        return "";
    });
    return { replacedLine, prNumber };
}

function formatError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

async function fetchCommitInfo(repo: string, commit: string): Promise<{ links: { commit?: string }; user?: string }> {
    try {
        const info = await getInfo({ repo, commit });
        return { links: info.links, user: info.user ?? undefined };
    } catch (error) {
        console.warn(`コミット ${commit} のGitHub情報取得に失敗:`, formatError(error));
        return { links: {}, user: undefined };
    }
}

async function fetchPrInfo(
    repo: string,
    pr: number,
): Promise<Awaited<ReturnType<typeof getInfoFromPullRequest>> | null> {
    try {
        return await getInfoFromPullRequest({ repo, pull: pr });
    } catch (error) {
        console.warn(`PR #${pr} のGitHub情報取得に失敗:`, formatError(error));
        return null;
    }
}

function appendLinksToFirstLine(line: string, commitLink?: string, prLink?: string, user?: string): string {
    let result = line;
    if (commitLink) result += ` (${commitLink})`;
    if (prLink) result += ` (${prLink})`;
    if (user) result += ` (${user})`;
    return result;
}

const changelogFunctions: ChangelogFunctions = {
    async getReleaseLine(changeset, _type, options) {
        if (!options?.repo) throw new Error(REPO_ERROR_MESSAGE);

        const summaryLines = changeset.summary.split("\n").map((l) => l.trimEnd());
        const firstLine = summaryLines[0] ?? "";
        const futureLines = summaryLines.slice(1);
        const { replacedLine, prNumber } = parsePrFromFirstLine(firstLine);

        const [commit] = changeset.commit?.split(",") ?? [];
        const commitToFetch = commit ?? changeset.id;
        const { links, user } = await fetchCommitInfo(options.repo, commitToFetch);

        const prInfo = prNumber === undefined ? null : await fetchPrInfo(options.repo, prNumber);

        const baseLine = `- ${replacedLine || changeset.summary}`;
        const firstLineWithLinks = appendLinksToFirstLine(baseLine, links.commit, prInfo?.links.pull, user);
        const changelogLines = [firstLineWithLinks, ...futureLines.map((l) => `  ${l}`)];

        return changelogLines.join("\n");
    },
    async getDependencyReleaseLine(changesets, dependenciesUpdated, options) {
        if (!options?.repo) throw new Error(REPO_ERROR_MESSAGE);

        if (dependenciesUpdated.length === 0) return "";

        const changesetLinks = changesets.map((cs) => {
            const commitLink = cs.commit ? ` (${cs.commit})` : "";
            return `- 依存関係を更新${commitLink}`;
        });

        const updatedDepenenciesList = dependenciesUpdated.map((dep) => `  - ${dep.name}@${dep.newVersion}`);

        return [...changesetLinks, ...updatedDepenenciesList].join("\n");
    },
};

export default changelogFunctions;
