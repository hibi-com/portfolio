export function appHostname(env: string, app: string, baseDomain: string): string {
    if (env === "prd") return `${app}.${baseDomain}`;
    return `${env}.${app}.${baseDomain}`;
}

export function dnsRecordName(env: string, app: string): string {
    if (env === "prd") return app;
    return `${env}.${app}`;
}
