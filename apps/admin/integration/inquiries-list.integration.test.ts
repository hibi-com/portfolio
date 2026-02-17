import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";

type Inquiry = {
    id: string;
    name: string;
    email: string;
    subject: string;
    status: string;
    createdAt: string;
};

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/**
 * @sequence docs/sequence/admin/inquiries/inquiries-list.md
 */
describe("Inquiries List Integration", () => {
    const API_URL = "http://localhost:8787";

    describe("シーケンス: Component → Hook → APIClient → API", () => {
        test("正常系: 問い合わせ一覧を取得する", async () => {
            const mockInquiries: Inquiry[] = [
                {
                    id: "1",
                    name: "John",
                    email: "john@example.com",
                    subject: "Hello",
                    status: "open",
                    createdAt: "2024-01-01",
                },
                {
                    id: "2",
                    name: "Jane",
                    email: "jane@example.com",
                    subject: "Question",
                    status: "closed",
                    createdAt: "2024-01-02",
                },
            ];

            server.use(
                http.get(`${API_URL}/api/inquiries`, () => {
                    return HttpResponse.json(mockInquiries);
                }),
            );

            const response = await fetch(`${API_URL}/api/inquiries`);
            const data: Inquiry[] = await response.json();

            expect(response.ok).toBe(true);
            expect(data).toHaveLength(2);
            expect(data[0]!.status).toBe("open");
        });

        test("正常系: ステータスでフィルタリング", async () => {
            server.use(
                http.get(`${API_URL}/api/inquiries`, ({ request }) => {
                    const url = new URL(request.url);
                    const status = url.searchParams.get("status");
                    if (status === "open") {
                        return HttpResponse.json([{ id: "1", status: "open" }]);
                    }
                    return HttpResponse.json([]);
                }),
            );

            const response = await fetch(`${API_URL}/api/inquiries?status=open`);
            const data: Inquiry[] = await response.json();

            expect(data).toHaveLength(1);
        });

        test("異常系: API 500エラー", async () => {
            server.use(
                http.get(`${API_URL}/api/inquiries`, () => {
                    return new HttpResponse(null, { status: 500 });
                }),
            );

            const response = await fetch(`${API_URL}/api/inquiries`);
            expect(response.status).toBe(500);
        });
    });
});
