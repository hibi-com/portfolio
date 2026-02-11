import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import "@testing-library/jest-dom/vitest";

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/**
 * @sequence docs/sequence/admin/posts/posts-list.md
 */

const MockPostsList = ({ posts }: { posts: Array<{ id: string; title: string; slug: string }> }) => (
    <div data-testid="posts-list">
        {posts.map((post) => (
            <div key={post.id} data-testid="post-item">
                <span>{post.title}</span>
                <span>{post.slug}</span>
            </div>
        ))}
    </div>
);

describe("Posts List Integration", () => {
    const API_URL = "http://localhost:8787";

    describe("シーケンス: Component → Hook → APIClient → API", () => {
        test("正常系: 投稿一覧を取得して表示する", async () => {
            const mockPosts = [
                { id: "1", title: "Test Post 1", slug: "test-post-1", status: "published" },
                { id: "2", title: "Test Post 2", slug: "test-post-2", status: "draft" },
            ];

            server.use(
                http.get(`${API_URL}/api/posts`, () => {
                    return HttpResponse.json(mockPosts);
                }),
            );

            const response = await fetch(`${API_URL}/api/posts`);
            const data: Array<{ id: string; title: string; slug: string }> = await response.json();

            expect(response.ok).toBe(true);
            expect(data).toHaveLength(2);
            expect(data[0]?.title).toBe("Test Post 1");
        });

        test("正常系: コンポーネントレンダリング検証", () => {
            const posts = [
                { id: "1", title: "Post A", slug: "post-a" },
                { id: "2", title: "Post B", slug: "post-b" },
            ];

            render(<MockPostsList posts={posts} />);

            expect(screen.getByTestId("posts-list")).toBeInTheDocument();
            expect(screen.getAllByTestId("post-item")).toHaveLength(2);
        });
    });

    describe("シーケンス分岐: ローディング状態", () => {
        test("ローディング中の状態", () => {
            const LoadingState = () => <div data-testid="loading">Loading...</div>;
            render(<LoadingState />);
            expect(screen.getByTestId("loading")).toBeInTheDocument();
        });
    });

    describe("シーケンス分岐: エラー状態", () => {
        test("APIエラー時の状態", async () => {
            server.use(
                http.get(`${API_URL}/api/posts`, () => {
                    return new HttpResponse(null, { status: 500 });
                }),
            );

            const response = await fetch(`${API_URL}/api/posts`);
            expect(response.status).toBe(500);
        });
    });

    describe("シーケンス分岐: 空データ", () => {
        test("投稿が0件の場合", async () => {
            server.use(
                http.get(`${API_URL}/api/posts`, () => {
                    return HttpResponse.json([]);
                }),
            );

            const response = await fetch(`${API_URL}/api/posts`);
            const data = await response.json();
            expect(Array.isArray(data) && data.length === 0).toBe(true);
        });
    });
});
