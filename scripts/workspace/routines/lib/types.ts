#!/usr/bin/env bun

export type StepId = "env" | "install" | "docker";

export interface SetupOptions {
    env?: boolean;
    install?: boolean;
    docker?: boolean;
    parallel?: boolean;
}

export interface ResolvedOptions {
    runEnv: boolean;
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
