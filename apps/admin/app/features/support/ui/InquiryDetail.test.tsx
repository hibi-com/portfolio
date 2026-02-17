import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { InquiryDetail as InquiryDetailType } from "../lib/useInquiries";
import * as useInquiriesModule from "../lib/useInquiries";
import { InquiryDetail } from "./InquiryDetail";

vi.mock("../lib/useInquiries");

const createTestRouter = (inquiryId: string) => {
    const rootRoute = createRootRoute();
    const inquiryRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/support/inquiries/$id",
        component: () => <InquiryDetail id={inquiryId} />,
    });

    const routeTree = rootRoute.addChildren([inquiryRoute]);
    return createRouter({ routeTree });
};

describe("InquiryDetail", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("表示", () => {
        describe("正常系", () => {
            test("問い合わせ詳細を表示する", async () => {
                const mockInquiry: InquiryDetailType = {
                    id: "1",
                    subject: "Test Inquiry",
                    content: "This is test content",
                    type: "QUESTION",
                    status: "OPEN",
                    priority: "MEDIUM",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01T00:00:00Z",
                    updatedAt: "2024-01-01T00:00:00Z",
                    responses: [],
                };

                vi.mocked(useInquiriesModule.useInquiryDetail).mockReturnValue({
                    inquiry: mockInquiry,
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    respond: vi.fn(),
                });

                const router = createTestRouter("1");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/support/inquiries/$id", params: { id: "1" } });

                await waitFor(() => {
                    expect(screen.getByText("Test Inquiry")).toBeInTheDocument();
                    expect(screen.getByText("This is test content")).toBeInTheDocument();
                    expect(screen.getByText("OPEN")).toBeInTheDocument();
                    expect(screen.getByText("MEDIUM")).toBeInTheDocument();
                });
            });

            test("レスポンスリストを表示する", async () => {
                const mockInquiry: InquiryDetailType = {
                    id: "1",
                    subject: "Test",
                    content: "Content",
                    type: "QUESTION",
                    status: "IN_PROGRESS",
                    priority: "HIGH",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01T00:00:00Z",
                    updatedAt: "2024-01-01T00:00:00Z",
                    responses: [
                        {
                            id: "r1",
                            inquiryId: "1",
                            content: "Customer response",
                            isInternal: false,
                            createdAt: "2024-01-01T10:00:00Z",
                            updatedAt: "2024-01-01T10:00:00Z",
                        },
                        {
                            id: "r2",
                            inquiryId: "1",
                            content: "Staff response",
                            isInternal: false,
                            userId: "user-1",
                            createdAt: "2024-01-01T11:00:00Z",
                            updatedAt: "2024-01-01T11:00:00Z",
                        },
                    ],
                };

                vi.mocked(useInquiriesModule.useInquiryDetail).mockReturnValue({
                    inquiry: mockInquiry,
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    respond: vi.fn(),
                });

                const router = createTestRouter("1");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/support/inquiries/$id", params: { id: "1" } });

                await waitFor(() => {
                    expect(screen.getByText("Customer response")).toBeInTheDocument();
                    expect(screen.getByText("Staff response")).toBeInTheDocument();
                    expect(screen.getByText(/Responses \(2\)/)).toBeInTheDocument();
                });
            });

            test("内部メモが正しく表示される", async () => {
                const mockInquiry: InquiryDetailType = {
                    id: "1",
                    subject: "Test",
                    content: "Content",
                    type: "QUESTION",
                    status: "OPEN",
                    priority: "LOW",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01T00:00:00Z",
                    updatedAt: "2024-01-01T00:00:00Z",
                    responses: [
                        {
                            id: "r1",
                            inquiryId: "1",
                            content: "Internal note",
                            isInternal: true,
                            userId: "user-1",
                            createdAt: "2024-01-01T10:00:00Z",
                            updatedAt: "2024-01-01T10:00:00Z",
                        },
                    ],
                };

                vi.mocked(useInquiriesModule.useInquiryDetail).mockReturnValue({
                    inquiry: mockInquiry,
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    respond: vi.fn(),
                });

                const router = createTestRouter("1");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/support/inquiries/$id", params: { id: "1" } });

                await waitFor(() => {
                    expect(screen.getByText("Internal note")).toBeInTheDocument();
                    expect(screen.getByText("Internal")).toBeInTheDocument();
                });
            });

            test("レスポンスがない場合は空状態を表示する", async () => {
                const mockInquiry: InquiryDetailType = {
                    id: "1",
                    subject: "Test",
                    content: "Content",
                    type: "QUESTION",
                    status: "OPEN",
                    priority: "MEDIUM",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01T00:00:00Z",
                    updatedAt: "2024-01-01T00:00:00Z",
                    responses: [],
                };

                vi.mocked(useInquiriesModule.useInquiryDetail).mockReturnValue({
                    inquiry: mockInquiry,
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    respond: vi.fn(),
                });

                const router = createTestRouter("1");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/support/inquiries/$id", params: { id: "1" } });

                await waitFor(() => {
                    expect(screen.getByText("No responses yet")).toBeInTheDocument();
                });
            });
        });

        describe("境界値", () => {
            test("CLOSEDステータスの場合は返信フォームを表示しない", async () => {
                const mockInquiry: InquiryDetailType = {
                    id: "1",
                    subject: "Closed Inquiry",
                    content: "Content",
                    type: "QUESTION",
                    status: "CLOSED",
                    priority: "MEDIUM",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01T00:00:00Z",
                    updatedAt: "2024-01-01T00:00:00Z",
                    responses: [],
                };

                vi.mocked(useInquiriesModule.useInquiryDetail).mockReturnValue({
                    inquiry: mockInquiry,
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    respond: vi.fn(),
                });

                const router = createTestRouter("1");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/support/inquiries/$id", params: { id: "1" } });

                await waitFor(() => {
                    expect(screen.getByText("Closed Inquiry")).toBeInTheDocument();
                });

                expect(screen.queryByText("Reply")).not.toBeInTheDocument();
                expect(screen.queryByPlaceholderText("Type your response...")).not.toBeInTheDocument();
            });

            test("OPEN以外のステータスでも返信フォームを表示する", async () => {
                const mockInquiry: InquiryDetailType = {
                    id: "1",
                    subject: "In Progress",
                    content: "Content",
                    type: "QUESTION",
                    status: "IN_PROGRESS",
                    priority: "MEDIUM",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01T00:00:00Z",
                    updatedAt: "2024-01-01T00:00:00Z",
                    responses: [],
                };

                vi.mocked(useInquiriesModule.useInquiryDetail).mockReturnValue({
                    inquiry: mockInquiry,
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    respond: vi.fn(),
                });

                const router = createTestRouter("1");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/support/inquiries/$id", params: { id: "1" } });

                await waitFor(() => {
                    expect(screen.getByText("Reply")).toBeInTheDocument();
                    expect(screen.getByPlaceholderText("Type your response...")).toBeInTheDocument();
                });
            });
        });

        describe("異常系", () => {
            test("ローディング中は読み込み中を表示する", async () => {
                vi.mocked(useInquiriesModule.useInquiryDetail).mockReturnValue({
                    inquiry: null,
                    loading: true,
                    error: null,
                    refetch: vi.fn(),
                    respond: vi.fn(),
                });

                const router = createTestRouter("1");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/support/inquiries/$id", params: { id: "1" } });

                await waitFor(() => {
                    expect(screen.getByText("Loading inquiry...")).toBeInTheDocument();
                });
            });

            test("エラー時はエラーメッセージを表示する", async () => {
                const error = new Error("Failed to load inquiry");

                vi.mocked(useInquiriesModule.useInquiryDetail).mockReturnValue({
                    inquiry: null,
                    loading: false,
                    error,
                    refetch: vi.fn(),
                    respond: vi.fn(),
                });

                const router = createTestRouter("1");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/support/inquiries/$id", params: { id: "1" } });

                await waitFor(() => {
                    expect(screen.getByText(/Failed to load inquiry/)).toBeInTheDocument();
                });
            });

            test("問い合わせが見つからない場合はエラーを表示する", async () => {
                vi.mocked(useInquiriesModule.useInquiryDetail).mockReturnValue({
                    inquiry: null,
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    respond: vi.fn(),
                });

                const router = createTestRouter("1");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/support/inquiries/$id", params: { id: "1" } });

                await waitFor(() => {
                    expect(screen.getByText(/Not found/)).toBeInTheDocument();
                });
            });
        });
    });

    describe("返信機能", () => {
        describe("正常系", () => {
            test("返信フォームに入力して送信できる", async () => {
                const mockInquiry: InquiryDetailType = {
                    id: "1",
                    subject: "Test",
                    content: "Content",
                    type: "QUESTION",
                    status: "OPEN",
                    priority: "MEDIUM",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01T00:00:00Z",
                    updatedAt: "2024-01-01T00:00:00Z",
                    responses: [],
                };

                const mockRespond = vi.fn().mockResolvedValue({
                    id: "r1",
                    inquiryId: "1",
                    content: "Test response",
                    isInternal: false,
                    userId: "user-1",
                    createdAt: "2024-01-02T00:00:00Z",
                    updatedAt: "2024-01-02T00:00:00Z",
                });

                vi.mocked(useInquiriesModule.useInquiryDetail).mockReturnValue({
                    inquiry: mockInquiry,
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    respond: mockRespond,
                });

                const router = createTestRouter("1");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/support/inquiries/$id", params: { id: "1" } });

                await waitFor(() => {
                    expect(screen.getByPlaceholderText("Type your response...")).toBeInTheDocument();
                });

                const textarea = screen.getByPlaceholderText("Type your response...");
                const sendButton = screen.getByText("Send");

                fireEvent.change(textarea, { target: { value: "Test response" } });
                fireEvent.click(sendButton);

                await waitFor(() => {
                    expect(mockRespond).toHaveBeenCalledWith({
                        message: "Test response",
                        isInternal: false,
                    });
                });
            });

            test("内部メモとして返信できる", async () => {
                const mockInquiry: InquiryDetailType = {
                    id: "1",
                    subject: "Test",
                    content: "Content",
                    type: "QUESTION",
                    status: "OPEN",
                    priority: "MEDIUM",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01T00:00:00Z",
                    updatedAt: "2024-01-01T00:00:00Z",
                    responses: [],
                };

                const mockRespond = vi.fn().mockResolvedValue({
                    id: "r1",
                    inquiryId: "1",
                    content: "Internal note",
                    isInternal: true,
                    userId: "user-1",
                    createdAt: "2024-01-02T00:00:00Z",
                    updatedAt: "2024-01-02T00:00:00Z",
                });

                vi.mocked(useInquiriesModule.useInquiryDetail).mockReturnValue({
                    inquiry: mockInquiry,
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    respond: mockRespond,
                });

                const router = createTestRouter("1");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/support/inquiries/$id", params: { id: "1" } });

                await waitFor(() => {
                    expect(screen.getByPlaceholderText("Type your response...")).toBeInTheDocument();
                });

                const textarea = screen.getByPlaceholderText("Type your response...");
                const checkbox = screen.getByRole("checkbox");
                const sendButton = screen.getByText("Send");

                fireEvent.change(textarea, { target: { value: "Internal note" } });
                fireEvent.click(checkbox);
                fireEvent.click(sendButton);

                await waitFor(() => {
                    expect(mockRespond).toHaveBeenCalledWith({
                        message: "Internal note",
                        isInternal: true,
                    });
                });
            });
        });

        describe("境界値", () => {
            test("空のメッセージでは送信ボタンがdisabledになる", async () => {
                const mockInquiry: InquiryDetailType = {
                    id: "1",
                    subject: "Test",
                    content: "Content",
                    type: "QUESTION",
                    status: "OPEN",
                    priority: "MEDIUM",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01T00:00:00Z",
                    updatedAt: "2024-01-01T00:00:00Z",
                    responses: [],
                };

                vi.mocked(useInquiriesModule.useInquiryDetail).mockReturnValue({
                    inquiry: mockInquiry,
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    respond: vi.fn(),
                });

                const router = createTestRouter("1");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/support/inquiries/$id", params: { id: "1" } });

                await waitFor(() => {
                    expect(screen.getByPlaceholderText("Type your response...")).toBeInTheDocument();
                });

                const sendButton = screen.getByText("Send");
                expect(sendButton).toBeDisabled();
            });
        });

        describe("異常系", () => {
            test("返信エラー時もエラーハンドリングされる", async () => {
                const mockInquiry: InquiryDetailType = {
                    id: "1",
                    subject: "Test",
                    content: "Content",
                    type: "QUESTION",
                    status: "OPEN",
                    priority: "MEDIUM",
                    email: "test@example.com",
                    name: "Test User",
                    createdAt: "2024-01-01T00:00:00Z",
                    updatedAt: "2024-01-01T00:00:00Z",
                    responses: [],
                };

                const mockRespond = vi.fn().mockRejectedValue(new Error("Response failed"));

                vi.mocked(useInquiriesModule.useInquiryDetail).mockReturnValue({
                    inquiry: mockInquiry,
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    respond: mockRespond,
                });

                const router = createTestRouter("1");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/support/inquiries/$id", params: { id: "1" } });

                await waitFor(() => {
                    expect(screen.getByPlaceholderText("Type your response...")).toBeInTheDocument();
                });

                const textarea = screen.getByPlaceholderText("Type your response...");
                const sendButton = screen.getByText("Send");

                fireEvent.change(textarea, { target: { value: "Test" } });
                fireEvent.click(sendButton);

                await waitFor(() => {
                    expect(mockRespond).toHaveBeenCalled();
                });

                // エラーはフックで処理されるため、UIには影響しない
            });
        });
    });
});
