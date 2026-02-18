export type VersionType = "major" | "minor" | "patch";

export type ChangeCategory =
    | "feat"
    | "fix"
    | "docs"
    | "style"
    | "refactor"
    | "perf"
    | "test"
    | "build"
    | "ci"
    | "chore"
    | "revert"
    | "improvement"
    | "security";

export interface ChangesetData {
    packages: string[];
    versionType: VersionType;
    category: ChangeCategory;
    summary: string;
}

export interface PackageInfo {
    name: string;
    path: string;
}
