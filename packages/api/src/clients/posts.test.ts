import type { Post, PostsListPosts200, PostsListPostsParams } from "@generated/api.schemas";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@generated/posts/posts", () => ({
    getPosts: vi.fn(() => ({
        postsListPosts: vi.fn(),
        postsGetPostBySlug: vi.fn(),
    })),
}));

import { getPosts } from "@generated/posts/posts";
import { getPostBySlug, listPosts, posts } from "./posts";

describe("posts client", () => {
    const mockPostsListPosts = vi.fn();
    const mockPostsGetPostBySlug = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getPosts).mockReturnValue({
            postsListPosts: mockPostsListPosts,
            postsGetPostBySlug: mockPostsGetPostBySlug,
        });
    });

    describe("listPosts", () => {
        describe("正常系", () => {
            test("パラメータなしで全投稿を取得する", async () => {
                const mockResponse: PostsListPosts200 = {
                    data: [
                        {
                            id: "1",
                            slug: "test-post",
                            title: "Test Post",
                            date: "2024-01-01",
                            content: { html: "<p>Test</p>" },
                            imageTemp: "/images/test.jpg",
                            tags: ["tech"],
                            sticky: false,
                        },
                    ],
                    meta: { total: 1, page: 1, perPage: 10, totalPages: 1 },
                };
                mockPostsListPosts.mockResolvedValue(mockResponse);

                const result = await listPosts();

                expect(result).toEqual(mockResponse);
                expect(mockPostsListPosts).toHaveBeenCalledWith(undefined);
                expect(mockPostsListPosts).toHaveBeenCalledTimes(1);
            });

            test("ページネーションパラメータを渡して投稿を取得する", async () => {
                const params: PostsListPostsParams = { page: 2, perPage: 5 };
                const mockResponse: PostsListPosts200 = {
                    data: [],
                    meta: { total: 10, page: 2, perPage: 5, totalPages: 2 },
                };
                mockPostsListPosts.mockResolvedValue(mockResponse);

                const result = await listPosts(params);

                expect(result).toEqual(mockResponse);
                expect(mockPostsListPosts).toHaveBeenCalledWith(params);
            });

            test("tagフィルターを渡して投稿を取得する", async () => {
                const params: PostsListPostsParams = { tag: "tech" };
                const mockResponse: PostsListPosts200 = {
                    data: [],
                    meta: { total: 0, page: 1, perPage: 10, totalPages: 0 },
                };
                mockPostsListPosts.mockResolvedValue(mockResponse);

                const result = await listPosts(params);

                expect(result).toEqual(mockResponse);
                expect(mockPostsListPosts).toHaveBeenCalledWith(params);
            });
        });

        describe("エッジケース", () => {
            test("空の配列が返される場合", async () => {
                const mockResponse: PostsListPosts200 = {
                    data: [],
                    meta: { total: 0, page: 1, perPage: 10, totalPages: 0 },
                };
                mockPostsListPosts.mockResolvedValue(mockResponse);

                const result = await listPosts();

                expect(result).toEqual(mockResponse);
            });

            test("配列形式で返される場合", async () => {
                const mockResponse: Post[] = [
                    {
                        id: "1",
                        slug: "test",
                        title: "Test",
                        date: "2024-01-01",
                        content: { html: "" },
                        imageTemp: "",
                        tags: [],
                        sticky: false,
                    },
                ];
                mockPostsListPosts.mockResolvedValue(mockResponse);

                const result = await listPosts();

                expect(result).toEqual(mockResponse);
            });
        });

        describe("異常系", () => {
            test("APIエラーの場合はエラーをそのまま伝播する", async () => {
                const error = new Error("API Error");
                mockPostsListPosts.mockRejectedValue(error);

                await expect(listPosts()).rejects.toThrow("API Error");
            });
        });
    });

    describe("getPostBySlug", () => {
        describe("正常系", () => {
            test("slugで投稿を取得する", async () => {
                const slug = "test-post";
                const mockPost: Post = {
                    id: "1",
                    slug: "test-post",
                    title: "Test Post",
                    date: "2024-01-01",
                    content: { html: "<p>Test</p>" },
                    imageTemp: "/images/test.jpg",
                    tags: ["tech"],
                    sticky: false,
                };
                mockPostsGetPostBySlug.mockResolvedValue(mockPost);

                const result = await getPostBySlug(slug);

                expect(result).toEqual(mockPost);
                expect(mockPostsGetPostBySlug).toHaveBeenCalledWith(slug);
                expect(mockPostsGetPostBySlug).toHaveBeenCalledTimes(1);
            });

            test("日本語slugで投稿を取得する", async () => {
                const slug = "日本語スラッグ";
                const mockPost: Post = {
                    id: "2",
                    slug: "日本語スラッグ",
                    title: "日本語タイトル",
                    date: "2024-01-01",
                    content: { html: "<p>日本語</p>" },
                    imageTemp: "/images/jp.jpg",
                    tags: ["日本語"],
                    sticky: false,
                };
                mockPostsGetPostBySlug.mockResolvedValue(mockPost);

                const result = await getPostBySlug(slug);

                expect(result).toEqual(mockPost);
                expect(mockPostsGetPostBySlug).toHaveBeenCalledWith(slug);
            });
        });

        describe("境界値", () => {
            test("空文字のslugを渡す", async () => {
                const slug = "";
                mockPostsGetPostBySlug.mockResolvedValue(null);

                await getPostBySlug(slug);

                expect(mockPostsGetPostBySlug).toHaveBeenCalledWith("");
            });

            test("特殊文字を含むslugを渡す", async () => {
                const slug = "post-with-special-chars-123";
                const mockPost: Post = {
                    id: "3",
                    slug: slug,
                    title: "Special Post",
                    date: "2024-01-01",
                    content: { html: "<p>Content</p>" },
                    imageTemp: "/images/special.jpg",
                    tags: [],
                    sticky: false,
                };
                mockPostsGetPostBySlug.mockResolvedValue(mockPost);

                const result = await getPostBySlug(slug);

                expect(result).toEqual(mockPost);
            });
        });

        describe("異常系", () => {
            test("存在しないslugの場合はAPIエラーを伝播する", async () => {
                const slug = "non-existent";
                const error = new Error("Not Found");
                mockPostsGetPostBySlug.mockRejectedValue(error);

                await expect(getPostBySlug(slug)).rejects.toThrow("Not Found");
            });
        });
    });

    describe("posts オブジェクト", () => {
        test("listメソッドが正しく動作する", async () => {
            const mockResponse: PostsListPosts200 = {
                data: [],
                meta: { total: 0, page: 1, perPage: 10, totalPages: 0 },
            };
            mockPostsListPosts.mockResolvedValue(mockResponse);

            const result = await posts.list();

            expect(result).toEqual(mockResponse);
        });

        test("getBySlugメソッドが正しく動作する", async () => {
            const mockPost: Post = {
                id: "1",
                slug: "test",
                title: "Test",
                date: "2024-01-01",
                content: { html: "" },
                imageTemp: "",
                tags: [],
                sticky: false,
            };
            mockPostsGetPostBySlug.mockResolvedValue(mockPost);

            const result = await posts.getBySlug("test");

            expect(result).toEqual(mockPost);
        });
    });
});
