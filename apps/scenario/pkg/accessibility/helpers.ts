export type TestContext = "app" | "storybook";

export interface TestConfig {
    name: string;
    context: TestContext;
    url: string;
}

export function getTestContext(): TestContext | "all" {
    return (process.env.TEST_CONTEXT as TestContext | undefined) || "all";
}

export function getTestConfigs(): TestConfig[] {
    const testContext = getTestContext();

    const configs: TestConfig[] = [
        {
            name: "実アプリケーション",
            context: "app",
            url: "/",
        },
        {
            name: "Storybook (Home)",
            context: "storybook",
            url: "/iframe.html?id=pages-home--default",
        },
    ];

    return testContext === "all" ? configs : configs.filter((config) => testContext === config.context);
}
