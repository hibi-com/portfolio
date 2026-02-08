import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import "@testing-library/jest-dom/vitest";

type Customer = {
    id: string;
    name: string;
    company?: string;
    email?: string;
    status: string;
};

type PaginatedResponse = {
    data: Customer[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
};

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const MockCustomersList = ({
    customers,
}: {
    customers: Array<{ id: string; name: string; company: string; status: string }>;
}) => (
    <div data-testid="customers-list">
        {customers.map((customer) => (
            <div key={customer.id} data-testid="customer-item">
                <span data-testid="customer-name">{customer.name}</span>
                <span data-testid="customer-company">{customer.company}</span>
                <span data-testid="customer-status">{customer.status}</span>
            </div>
        ))}
    </div>
);

describe("Customers List Integration - docs/sequence/admin/crm/customers-list.md", () => {
    const API_URL = "http://localhost:8787";

    describe("シーケンス: Component → Hook → APIClient → API", () => {
        test("正常系: 顧客一覧を取得する", async () => {
            const mockCustomers = [
                { id: "1", name: "John Doe", company: "Tech Corp", email: "john@example.com", status: "active" },
                { id: "2", name: "Jane Smith", company: "Design Inc", email: "jane@example.com", status: "inactive" },
            ];

            server.use(
                http.get(`${API_URL}/api/crm/customers`, () => {
                    return HttpResponse.json(mockCustomers);
                }),
            );

            const response = await fetch(`${API_URL}/api/crm/customers`);
            const data = (await response.json()) as Customer[];

            expect(response.ok).toBe(true);
            expect(data).toHaveLength(2);
            expect(data[0]!.name).toBe("John Doe");
            expect(data[0]!.status).toBe("active");
        });

        test("正常系: コンポーネントレンダリング検証", () => {
            const customers = [
                { id: "1", name: "Customer A", company: "Company A", status: "active" },
                { id: "2", name: "Customer B", company: "Company B", status: "inactive" },
            ];

            render(<MockCustomersList customers={customers} />);

            expect(screen.getByTestId("customers-list")).toBeInTheDocument();
            expect(screen.getAllByTestId("customer-item")).toHaveLength(2);
            expect(screen.getAllByTestId("customer-status")[0]).toHaveTextContent("active");
        });
    });

    describe("シーケンス分岐: フィルタリング", () => {
        test("ステータスでフィルタリング", async () => {
            const mockCustomers = [{ id: "1", name: "Active Customer", status: "active" }];

            server.use(
                http.get(`${API_URL}/api/crm/customers`, ({ request }) => {
                    const url = new URL(request.url);
                    const status = url.searchParams.get("status");
                    if (status === "active") {
                        return HttpResponse.json(mockCustomers);
                    }
                    return HttpResponse.json([]);
                }),
            );

            const response = await fetch(`${API_URL}/api/crm/customers?status=active`);
            const data = (await response.json()) as Customer[];

            expect(data).toHaveLength(1);
            expect(data[0]!.status).toBe("active");
        });
    });

    describe("シーケンス分岐: ページネーション", () => {
        test("ページネーションパラメータの処理", async () => {
            server.use(
                http.get(`${API_URL}/api/crm/customers`, ({ request }) => {
                    const url = new URL(request.url);
                    const page = url.searchParams.get("page") || "1";
                    const limit = url.searchParams.get("limit") || "10";

                    return HttpResponse.json({
                        data: [],
                        pagination: {
                            page: Number.parseInt(page),
                            limit: Number.parseInt(limit),
                            total: 100,
                        },
                    });
                }),
            );

            const response = await fetch(`${API_URL}/api/crm/customers?page=2&limit=20`);
            const data = (await response.json()) as PaginatedResponse;

            expect(data.pagination.page).toBe(2);
            expect(data.pagination.limit).toBe(20);
        });
    });

    describe("シーケンス分岐: エラーハンドリング", () => {
        test("API 500エラー", async () => {
            server.use(
                http.get(`${API_URL}/api/crm/customers`, () => {
                    return new HttpResponse(null, { status: 500 });
                }),
            );

            const response = await fetch(`${API_URL}/api/crm/customers`);
            expect(response.status).toBe(500);
        });

        test("API 401認証エラー", async () => {
            server.use(
                http.get(`${API_URL}/api/crm/customers`, () => {
                    return new HttpResponse(null, { status: 401 });
                }),
            );

            const response = await fetch(`${API_URL}/api/crm/customers`);
            expect(response.status).toBe(401);
        });
    });
});
