import { existsSync } from "node:fs";
import { join } from "node:path";
import { $ } from "bun";
import { LoadingBar, logSection, logSubStep } from "../lib/env";
import type { DockerBuildTarget, StepContext } from "../lib/types";

export const DEFAULT_DOCKER_TARGETS: readonly DockerBuildTarget[] = [
    { imageName: "scenario", dockerfilePath: ".docker/scenario/Dockerfile", displayName: "シナリオテスト用" },
];

async function checkImageExists(imageName: string): Promise<boolean> {
    try {
        const result = await $`docker images --format {{.Repository}}:{{.Tag}}`.quiet();
        const images = result.stdout.toString().trim().split("\n");
        return images.some((img) => img.startsWith(`${imageName}:`) || img === imageName);
    } catch {
        return false;
    }
}

async function migrateLegacyE2eImage(imageName: string): Promise<boolean> {
    if (imageName !== "scenario") {
        return false;
    }
    if (await checkImageExists("scenario")) {
        return true;
    }
    if (!(await checkImageExists("e2e"))) {
        return false;
    }
    try {
        await $`docker tag e2e:latest scenario:latest`.quiet();
        logSubStep("旧 e2e イメージを scenario としてタグ付けしました", "success");
        return true;
    } catch {
        return false;
    }
}

async function buildImageWithLoadingBar(
    rootDir: string,
    target: DockerBuildTarget,
    dockerfileFullPath: string,
): Promise<void> {
    const loadingBar = new LoadingBar(`${target.displayName}Dockerイメージをビルドしています`);
    loadingBar.start();
    try {
        await $`docker build -t ${target.imageName} -f ${dockerfileFullPath} .`.cwd(rootDir).quiet();
        loadingBar.stop(true, `${target.displayName}Dockerイメージのビルドが完了しました`);
    } catch (error) {
        loadingBar.stop(false, `${target.displayName}Dockerイメージのビルドに失敗しました`);
        throw error;
    }
}

async function buildImageWithoutLoadingBar(
    rootDir: string,
    target: DockerBuildTarget,
    dockerfileFullPath: string,
): Promise<void> {
    logSubStep(`${target.displayName}Dockerイメージをビルドしています...`, "info");
    try {
        await $`docker build -t ${target.imageName} -f ${dockerfileFullPath} .`.cwd(rootDir).quiet();
        logSubStep(`${target.displayName}Dockerイメージのビルドが完了しました`, "success");
    } catch (error) {
        logSubStep(`${target.displayName}Dockerイメージのビルドに失敗しました`, "warning");
        throw error;
    }
}

async function buildTarget(rootDir: string, target: DockerBuildTarget, useLoadingBar: boolean): Promise<void> {
    const dockerfileFullPath = join(rootDir, target.dockerfilePath);

    if (!existsSync(dockerfileFullPath)) {
        return;
    }

    const imageExists = (await checkImageExists(target.imageName)) || (await migrateLegacyE2eImage(target.imageName));
    if (imageExists) {
        logSubStep(`${target.displayName}Dockerイメージは既に存在します`, "success");
        return;
    }

    if (useLoadingBar) {
        await buildImageWithLoadingBar(rootDir, target, dockerfileFullPath);
    } else {
        await buildImageWithoutLoadingBar(rootDir, target, dockerfileFullPath);
    }
}

export async function runDockerStep(ctx: StepContext): Promise<void> {
    const { rootDir, useLoadingBar, dockerTargets } = ctx;
    const targets = dockerTargets ?? [...DEFAULT_DOCKER_TARGETS];

    logSection("🐳 Dockerイメージのビルド");

    for (const target of targets) {
        try {
            await buildTarget(rootDir, target, useLoadingBar);
        } catch (error) {
            logSubStep(`${target.displayName}Dockerイメージのビルドに失敗しました`, "warning");
            if (process.env.DEBUG) {
                console.error(error);
            }
        }
    }
}
