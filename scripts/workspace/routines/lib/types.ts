#!/usr/bin/env bun

export type StepId = "install" | "docker";

export interface SetupOptions {
    install?: boolean;
    docker?: boolean;
    parallel?: boolean;
}

export interface ResolvedOptions {
    runInstall: boolean;
    runDocker: boolean;
    parallel: boolean;
}

export interface DockerBuildTarget {
    imageName: string;
    dockerfilePath: string;
    displayName: string;
}

export interface StepContext {
    rootDir: string;
    useLoadingBar: boolean;
    dockerTargets?: DockerBuildTarget[];
}

export type SetupStep = (ctx: StepContext) => Promise<void>;
