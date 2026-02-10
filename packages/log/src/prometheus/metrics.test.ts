import { beforeEach, describe, expect, it } from "vitest";
import { ErrorCodes } from "../errors/error-codes";
import { PrometheusClient } from "./client";
import { CommonMetrics } from "./metrics";

describe("CommonMetrics", () => {
    let client: PrometheusClient;
    let metrics: CommonMetrics;

    beforeEach(() => {
        client = new PrometheusClient();
        metrics = new CommonMetrics(client);
    });

    describe("HTTPメトリクス", () => {
        it("HTTPメトリクスが作成される", () => {
            expect(metrics.httpRequestDuration).toBeDefined();
            expect(metrics.httpRequestTotal).toBeDefined();
            expect(metrics.httpRequestErrors).toBeDefined();
        });

        it("HTTPリクエストの総数を記録できる", async () => {
            metrics.httpRequestTotal.inc({ method: "GET", route: "/api/users", status: "200" });
            const result = await metrics.httpRequestTotal.get();
            expect(result.values[0]?.value).toBe(1);
        });

        it("HTTPリクエストの処理時間を記録できる", async () => {
            metrics.httpRequestDuration.observe({ method: "GET", route: "/api/users", status: "200" }, 0.123);
            const result = await metrics.httpRequestDuration.get();
            expect(result.values.length).toBeGreaterThan(0);
        });

        it("HTTPリクエストエラーを記録できる", async () => {
            metrics.httpRequestErrors.inc({ method: "GET", route: "/api/users", status: "500" });
            const result = await metrics.httpRequestErrors.get();
            expect(result.values[0]?.value).toBe(1);
        });

        it("複数のHTTPリクエストを記録できる", async () => {
            metrics.httpRequestTotal.inc({ method: "GET", route: "/api/users", status: "200" });
            metrics.httpRequestTotal.inc({ method: "POST", route: "/api/users", status: "201" });
            const result = await metrics.httpRequestTotal.get();
            expect(result.values.length).toBe(2);
        });
    });

    describe("エラーメトリクス", () => {
        it("エラーメトリクスが作成される", () => {
            expect(metrics.errorsTotal).toBeDefined();
            expect(metrics.errorsByCode).toBeDefined();
        });

        it("エラーの総数を記録できる", async () => {
            metrics.errorsTotal.inc({ category: "AUTH", code: ErrorCodes.AUTH_INVALID_TOKEN });
            const result = await metrics.errorsTotal.get();
            expect(result.values[0]?.value).toBe(1);
        });

        it("エラーコード別のエラー数を記録できる", async () => {
            metrics.errorsByCode.inc({
                code: ErrorCodes.AUTH_INVALID_TOKEN,
                category: "AUTH",
            });
            const result = await metrics.errorsByCode.get();
            expect(result.values[0]?.value).toBe(1);
        });

        it("複数のエラーを記録できる", async () => {
            metrics.errorsTotal.inc({ category: "AUTH", code: ErrorCodes.AUTH_INVALID_TOKEN });
            metrics.errorsTotal.inc({ category: "VALIDATION", code: ErrorCodes.VALIDATION_MISSING_FIELD });
            const result = await metrics.errorsTotal.get();
            expect(result.values.length).toBe(2);
        });
    });

    describe("データベースメトリクス", () => {
        it("データベースメトリクスが作成される", () => {
            expect(metrics.dbQueryDuration).toBeDefined();
            expect(metrics.dbQueryTotal).toBeDefined();
            expect(metrics.dbConnections).toBeDefined();
        });

        it("データベースクエリの実行時間を記録できる", async () => {
            metrics.dbQueryDuration.observe({ operation: "SELECT", table: "users" }, 0.05);
            const result = await metrics.dbQueryDuration.get();
            expect(result.values.length).toBeGreaterThan(0);
        });

        it("データベースクエリの総数を記録できる", async () => {
            metrics.dbQueryTotal.inc({ operation: "SELECT", table: "users" });
            const result = await metrics.dbQueryTotal.get();
            expect(result.values[0]?.value).toBe(1);
        });

        it("データベース接続数を記録できる", async () => {
            metrics.dbConnections.set({ state: "active" }, 5);
            const result = await metrics.dbConnections.get();
            expect(result.values[0]?.value).toBe(5);
        });

        it("複数のデータベース操作を記録できる", async () => {
            metrics.dbQueryTotal.inc({ operation: "SELECT", table: "users" });
            metrics.dbQueryTotal.inc({ operation: "INSERT", table: "posts" });
            const result = await metrics.dbQueryTotal.get();
            expect(result.values.length).toBe(2);
        });
    });

    describe("キャッシュメトリクス", () => {
        it("キャッシュメトリクスが作成される", () => {
            expect(metrics.cacheHits).toBeDefined();
            expect(metrics.cacheMisses).toBeDefined();
            expect(metrics.cacheOperations).toBeDefined();
        });

        it("キャッシュヒット数を記録できる", async () => {
            metrics.cacheHits.inc({ key: "user:123" });
            const result = await metrics.cacheHits.get();
            expect(result.values[0]?.value).toBe(1);
        });

        it("キャッシュミス数を記録できる", async () => {
            metrics.cacheMisses.inc({ key: "user:123" });
            const result = await metrics.cacheMisses.get();
            expect(result.values[0]?.value).toBe(1);
        });

        it("キャッシュ操作を記録できる", async () => {
            metrics.cacheOperations.inc({ operation: "get", status: "success" });
            const result = await metrics.cacheOperations.get();
            expect(result.values[0]?.value).toBe(1);
        });

        it("複数のキャッシュ操作を記録できる", async () => {
            metrics.cacheOperations.inc({ operation: "get", status: "success" });
            metrics.cacheOperations.inc({ operation: "set", status: "success" });
            const result = await metrics.cacheOperations.get();
            expect(result.values.length).toBe(2);
        });
    });

    describe("メトリクスの再利用", () => {
        it("同じクライアントで複数のCommonMetricsインスタンスを作成できる", () => {
            const metrics1 = new CommonMetrics(client);
            const metrics2 = new CommonMetrics(client);
            expect(metrics1.httpRequestTotal).toBe(metrics2.httpRequestTotal);
        });
    });
});
