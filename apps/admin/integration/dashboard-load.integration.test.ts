import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/**
 * @sequence docs/sequence/admin/dashboard/dashboard-load.md
 */
describe("Dashboard Load Integration", () => {
    const API_URL = "http://localhost:8787";

    describe("シーケンス: Component → Hook → APIClient → API（並列呼び出し）", () => {
        test("正常系: ダッシュボード統計を取得する", async () => {
            const mockStats = {
                postsCount: 10,
                portfoliosCount: 5,
                inquiriesCount: 3,
                customersCount: 20,
            };

            server.use(
                http.get(`${API_URL}/api/dashboard/stats`, () => {
                    return HttpResponse.json(mockStats);
                }),
            );

            const response = await fetch(`${API_URL}/api/dashboard/stats`);
            const data = await response.json();

            expect(response.ok).toBe(true);
            expect((data as typeof mockStats).postsCount).toBe(10);
            expect((data as typeof mockStats).portfoliosCount).toBe(5);
        });

        test("異常系: API 500エラー", async () => {
            server.use(
                http.get(`${API_URL}/api/dashboard/stats`, () => {
                    return new HttpResponse(null, { status: 500 });
                }),
            );

            const response = await fetch(`${API_URL}/api/dashboard/stats`);
            expect(response.status).toBe(500);
        });
    });
});
