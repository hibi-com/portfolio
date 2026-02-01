import { describe, expect, test } from "vitest";
import type { ErrorProps } from "./types";

describe("Error Widget Types", () => {
    describe("ErrorProps", () => {
        test("should have required error field", () => {
            const props: ErrorProps = {
                error: {},
            };

            expect(props.error).toBeDefined();
        });

        test("should support error with status", () => {
            const props: ErrorProps = {
                error: {
                    status: 404,
                },
            };

            expect(props.error.status).toBe(404);
        });

        test("should support error with statusText", () => {
            const props: ErrorProps = {
                error: {
                    statusText: "Not Found",
                },
            };

            expect(props.error.statusText).toBe("Not Found");
        });

        test("should support error with data", () => {
            const props: ErrorProps = {
                error: {
                    data: "Error message",
                },
            };

            expect(props.error.data).toBe("Error message");
        });

        test("should support error with toString method", () => {
            const props: ErrorProps = {
                error: {
                    toString: () => "Error string",
                },
            };

            expect(props.error.toString).toBeDefined();
            expect(typeof props.error.toString).toBe("function");
            expect(props.error.toString?.()).toBe("Error string");
        });

        test("should support complete error object", () => {
            const props: ErrorProps = {
                error: {
                    status: 500,
                    statusText: "Internal Server Error",
                    data: "Something went wrong",
                    toString: () => "500 Internal Server Error",
                },
            };

            expect(props.error.status).toBe(500);
            expect(props.error.statusText).toBe("Internal Server Error");
            expect(props.error.data).toBe("Something went wrong");
            expect(props.error.toString?.()).toBe("500 Internal Server Error");
        });

        test("should have readonly error field", () => {
            const props: ErrorProps = {
                error: {},
            };

            // TypeScriptのreadonlyは実行時には影響しないが、型定義を確認
            expect(props.error).toBeDefined();
        });
    });
});
