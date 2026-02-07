export function init(_options?: unknown) {
    void 0;
}

export function captureException(_exception: unknown, _hint?: unknown): string | null {
    return null;
}

export function captureMessage(_message: string, _level?: "debug" | "info" | "warning" | "error"): string | null {
    return null;
}

export function setUser(_user: unknown) {
    void 0;
}

export function setContext(_name: string, _context: unknown) {
    void 0;
}

export function setTag(_key: string, _value: string) {
    void 0;
}

export function setTags(_tags: Record<string, string>) {
    void 0;
}

export function addBreadcrumb(_breadcrumb: unknown) {
    void 0;
}

export function withScope<T>(callback: (scope: unknown) => T): T {
    const mockScope = {} as unknown;
    return callback(mockScope);
}

export function close() {
    return Promise.resolve(true);
}

export function httpIntegration() {
    return {};
}

export function consoleIntegration() {
    return {};
}

export function onUncaughtExceptionIntegration(_options?: { exitEvenIfOtherHandlersAreRegistered?: boolean }) {
    return {};
}

export function onUnhandledRejectionIntegration(_options?: { mode?: "warn" | "none" }) {
    return {};
}

export default {
    init,
    captureException,
    captureMessage,
    setUser,
    setContext,
    setTag,
    setTags,
    addBreadcrumb,
    withScope,
    close,
    httpIntegration,
    consoleIntegration,
    onUncaughtExceptionIntegration,
    onUnhandledRejectionIntegration,
};
