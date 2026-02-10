import { describe, expect, it } from "vitest";
import { compareLogLevel, LogLevel, LogLevelPriority } from "./levels";

describe("LogLevel", () => {
    it("すべてのログレベルが定義されている", () => {
        expect(LogLevel.DEBUG).toBe("debug");
        expect(LogLevel.INFO).toBe("info");
        expect(LogLevel.WARN).toBe("warn");
        expect(LogLevel.ERROR).toBe("error");
    });
});

describe("LogLevelPriority", () => {
    it("すべてのログレベルに優先度が設定されている", () => {
        expect(LogLevelPriority[LogLevel.DEBUG]).toBe(0);
        expect(LogLevelPriority[LogLevel.INFO]).toBe(1);
        expect(LogLevelPriority[LogLevel.WARN]).toBe(2);
        expect(LogLevelPriority[LogLevel.ERROR]).toBe(3);
    });

    it("優先度が正しい順序になっている", () => {
        expect(LogLevelPriority[LogLevel.DEBUG]).toBeLessThan(LogLevelPriority[LogLevel.INFO]);
        expect(LogLevelPriority[LogLevel.INFO]).toBeLessThan(LogLevelPriority[LogLevel.WARN]);
        expect(LogLevelPriority[LogLevel.WARN]).toBeLessThan(LogLevelPriority[LogLevel.ERROR]);
    });
});

describe("compareLogLevel", () => {
    it("同じレベルの場合は0を返す", () => {
        expect(compareLogLevel(LogLevel.DEBUG, LogLevel.DEBUG)).toBe(0);
        expect(compareLogLevel(LogLevel.INFO, LogLevel.INFO)).toBe(0);
        expect(compareLogLevel(LogLevel.WARN, LogLevel.WARN)).toBe(0);
        expect(compareLogLevel(LogLevel.ERROR, LogLevel.ERROR)).toBe(0);
    });

    it("level1がlevel2より低い場合は負の値を返す", () => {
        expect(compareLogLevel(LogLevel.DEBUG, LogLevel.INFO)).toBeLessThan(0);
        expect(compareLogLevel(LogLevel.INFO, LogLevel.WARN)).toBeLessThan(0);
        expect(compareLogLevel(LogLevel.WARN, LogLevel.ERROR)).toBeLessThan(0);
        expect(compareLogLevel(LogLevel.DEBUG, LogLevel.ERROR)).toBeLessThan(0);
    });

    it("level1がlevel2より高い場合は正の値を返す", () => {
        expect(compareLogLevel(LogLevel.INFO, LogLevel.DEBUG)).toBeGreaterThan(0);
        expect(compareLogLevel(LogLevel.WARN, LogLevel.INFO)).toBeGreaterThan(0);
        expect(compareLogLevel(LogLevel.ERROR, LogLevel.WARN)).toBeGreaterThan(0);
        expect(compareLogLevel(LogLevel.ERROR, LogLevel.DEBUG)).toBeGreaterThan(0);
    });

    it("すべての組み合わせで正しく比較できる", () => {
        const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
        for (let i = 0; i < levels.length; i++) {
            for (let j = 0; j < levels.length; j++) {
                const result = compareLogLevel(levels[i]!, levels[j]!);
                if (i === j) {
                    expect(result).toBe(0);
                } else if (i < j) {
                    expect(result).toBeLessThan(0);
                } else {
                    expect(result).toBeGreaterThan(0);
                }
            }
        }
    });
});
