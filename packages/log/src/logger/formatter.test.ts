import { describe, expect, it } from "vitest";
import { defaultFormatter, JsonFormatter, type LogEntry, PlainTextFormatter } from "./formatter";
import { LogLevel } from "./levels";

describe("JsonFormatter", () => {
    const formatter = new JsonFormatter();

    it("基本的なログエントリをフォーマットできる", () => {
        const entry: LogEntry = {
            timestamp: "2024-01-01T00:00:00.000Z",
            level: LogLevel.INFO,
            message: "test message",
        };
        const formatted = formatter.format(entry);
        const parsed = JSON.parse(formatted);
        expect(parsed.timestamp).toBe("2024-01-01T00:00:00.000Z");
        expect(parsed.level).toBe("info");
        expect(parsed.message).toBe("test message");
    });

    it("contextを含むログエントリをフォーマットできる", () => {
        const entry: LogEntry = {
            timestamp: "2024-01-01T00:00:00.000Z",
            level: LogLevel.INFO,
            message: "test message",
            context: { service: "api", requestId: "123" },
        };
        const formatted = formatter.format(entry);
        const parsed = JSON.parse(formatted);
        expect(parsed.context).toEqual({ service: "api", requestId: "123" });
    });

    it("errorを含むログエントリをフォーマットできる", () => {
        const error = new Error("test error");
        error.stack = "Error: test error\n    at test";
        const entry: LogEntry = {
            timestamp: "2024-01-01T00:00:00.000Z",
            level: LogLevel.ERROR,
            message: "test message",
            error,
        };
        const formatted = formatter.format(entry);
        const parsed = JSON.parse(formatted);
        expect(parsed.error.name).toBe("Error");
        expect(parsed.error.message).toBe("test error");
        expect(parsed.error.stack).toBe("Error: test error\n    at test");
    });

    it("metadataを含むログエントリをフォーマットできる", () => {
        const entry: LogEntry = {
            timestamp: "2024-01-01T00:00:00.000Z",
            level: LogLevel.INFO,
            message: "test message",
            metadata: { userId: "123", action: "login" },
        };
        const formatted = formatter.format(entry);
        const parsed = JSON.parse(formatted);
        expect(parsed.metadata).toEqual({ userId: "123", action: "login" });
    });

    it("すべてのフィールドを含むログエントリをフォーマットできる", () => {
        const error = new Error("test error");
        const entry: LogEntry = {
            timestamp: "2024-01-01T00:00:00.000Z",
            level: LogLevel.ERROR,
            message: "test message",
            context: { service: "api" },
            error,
            metadata: { userId: "123" },
        };
        const formatted = formatter.format(entry);
        const parsed = JSON.parse(formatted);
        expect(parsed.timestamp).toBeDefined();
        expect(parsed.level).toBeDefined();
        expect(parsed.message).toBeDefined();
        expect(parsed.context).toBeDefined();
        expect(parsed.error).toBeDefined();
        expect(parsed.metadata).toBeDefined();
    });

    it("contextなしでもフォーマットできる", () => {
        const entry: LogEntry = {
            timestamp: "2024-01-01T00:00:00.000Z",
            level: LogLevel.INFO,
            message: "test message",
        };
        const formatted = formatter.format(entry);
        const parsed = JSON.parse(formatted);
        expect(parsed.context).toBeUndefined();
    });

    it("errorなしでもフォーマットできる", () => {
        const entry: LogEntry = {
            timestamp: "2024-01-01T00:00:00.000Z",
            level: LogLevel.INFO,
            message: "test message",
        };
        const formatted = formatter.format(entry);
        const parsed = JSON.parse(formatted);
        expect(parsed.error).toBeUndefined();
    });

    it("metadataなしでもフォーマットできる", () => {
        const entry: LogEntry = {
            timestamp: "2024-01-01T00:00:00.000Z",
            level: LogLevel.INFO,
            message: "test message",
        };
        const formatted = formatter.format(entry);
        const parsed = JSON.parse(formatted);
        expect(parsed.metadata).toBeUndefined();
    });

    it("すべてのログレベルでフォーマットできる", () => {
        for (const level of Object.values(LogLevel)) {
            const entry: LogEntry = {
                timestamp: "2024-01-01T00:00:00.000Z",
                level,
                message: "test message",
            };
            const formatted = formatter.format(entry);
            const parsed = JSON.parse(formatted);
            expect(parsed.level).toBe(level);
        }
    });
});

describe("PlainTextFormatter", () => {
    const formatter = new PlainTextFormatter();

    it("基本的なログエントリをフォーマットできる", () => {
        const entry: LogEntry = {
            timestamp: "2024-01-01T00:00:00.000Z",
            level: LogLevel.INFO,
            message: "test message",
        };
        const formatted = formatter.format(entry);
        expect(formatted).toContain("[2024-01-01T00:00:00.000Z]");
        expect(formatted).toContain("[INFO]");
        expect(formatted).toContain("test message");
    });

    it("contextを含むログエントリをフォーマットできる", () => {
        const entry: LogEntry = {
            timestamp: "2024-01-01T00:00:00.000Z",
            level: LogLevel.INFO,
            message: "test message",
            context: { service: "api" },
        };
        const formatted = formatter.format(entry);
        expect(formatted).toContain("Context:");
        expect(formatted).toContain('{"service":"api"}');
    });

    it("errorを含むログエントリをフォーマットできる", () => {
        const error = new Error("test error");
        error.stack = "Error: test error\n    at test";
        const entry: LogEntry = {
            timestamp: "2024-01-01T00:00:00.000Z",
            level: LogLevel.ERROR,
            message: "test message",
            error,
        };
        const formatted = formatter.format(entry);
        expect(formatted).toContain("Error: Error: test error");
        expect(formatted).toContain("Stack: Error: test error");
    });

    it("errorにstackがない場合でもフォーマットできる", () => {
        const error = new Error("test error");
        error.stack = undefined;
        const entry: LogEntry = {
            timestamp: "2024-01-01T00:00:00.000Z",
            level: LogLevel.ERROR,
            message: "test message",
            error,
        };
        const formatted = formatter.format(entry);
        expect(formatted).toContain("Error: Error: test error");
        expect(formatted).not.toContain("Stack:");
    });

    it("metadataを含むログエントリをフォーマットできる", () => {
        const entry: LogEntry = {
            timestamp: "2024-01-01T00:00:00.000Z",
            level: LogLevel.INFO,
            message: "test message",
            metadata: { userId: "123" },
        };
        const formatted = formatter.format(entry);
        expect(formatted).toContain("Metadata:");
        expect(formatted).toContain('{"userId":"123"}');
    });

    it("すべてのフィールドを含むログエントリをフォーマットできる", () => {
        const error = new Error("test error");
        const entry: LogEntry = {
            timestamp: "2024-01-01T00:00:00.000Z",
            level: LogLevel.ERROR,
            message: "test message",
            context: { service: "api" },
            error,
            metadata: { userId: "123" },
        };
        const formatted = formatter.format(entry);
        expect(formatted).toContain("[2024-01-01T00:00:00.000Z]");
        expect(formatted).toContain("[ERROR]");
        expect(formatted).toContain("test message");
        expect(formatted).toContain("Context:");
        expect(formatted).toContain("Error:");
        expect(formatted).toContain("Metadata:");
    });

    it("すべてのログレベルでフォーマットできる", () => {
        for (const level of Object.values(LogLevel)) {
            const entry: LogEntry = {
                timestamp: "2024-01-01T00:00:00.000Z",
                level,
                message: "test message",
            };
            const formatted = formatter.format(entry);
            expect(formatted).toContain(level.toUpperCase());
        }
    });
});

describe("defaultFormatter", () => {
    it("JsonFormatterのインスタンスである", () => {
        expect(defaultFormatter).toBeInstanceOf(JsonFormatter);
    });

    it("フォーマットできる", () => {
        const entry: LogEntry = {
            timestamp: "2024-01-01T00:00:00.000Z",
            level: LogLevel.INFO,
            message: "test message",
        };
        const formatted = defaultFormatter.format(entry);
        expect(() => JSON.parse(formatted)).not.toThrow();
    });
});
