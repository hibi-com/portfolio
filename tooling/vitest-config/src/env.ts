type Environment = "production" | "staging" | "development" | "test";

const DEFAULT_PORT = "3000";
const DEFAULT_BASE_URL = "http://localhost:3000";

function getEnvironmentFromBaseUrl(baseUrl: string): Environment {
    if (baseUrl.includes("ageha734.jp") && !baseUrl.includes("stg.") && !baseUrl.includes("rc.")) {
        return "production";
    }
    if (baseUrl.includes("stg.ageha734.jp")) {
        return "staging";
    }
    if (baseUrl.includes("rc.ageha734.jp")) {
        return "development";
    }
    if (baseUrl.includes("localhost")) {
        return "test";
    }
    return "development";
}

function getPortFromBaseUrl(baseUrl: string): string {
    try {
        const url = new URL(baseUrl);
        return url.port || DEFAULT_PORT;
    } catch {
        return DEFAULT_PORT;
    }
}

function setupTestEnvironment(): void {
    const baseUrl = process.env.VITE_BASE_URL ?? process.env.BASE_URL ?? DEFAULT_BASE_URL;

    process.env.BASE_URL = baseUrl;
    process.env.PORT = getPortFromBaseUrl(baseUrl);
    process.env.ENVIRONMENT = getEnvironmentFromBaseUrl(baseUrl);
    process.env.NODE_ENV = process.env.NODE_ENV ?? "test";
    process.env.GOOGLE_ANALYTICS = process.env.GOOGLE_ANALYTICS ?? "G-TEST123";
    process.env.GOOGLE_TAG_MANAGER = process.env.GOOGLE_TAG_MANAGER ?? "GTM-TEST123";
    process.env.TZ = "UTC";
}

setupTestEnvironment();
