/**
 * MSW (Mock Service Worker) の設定とハンドラーを提供するパッケージ
 *
 * 使用方法:
 * - Node.js環境（Vitestなど）: `import { server } from "@portfolio/testing-msw"`
 * - ブラウザ環境（Storybookなど）: `import { worker } from "@portfolio/testing-msw/browser"`
 * - ハンドラーのみ: `import { restHandlers } from "@portfolio/testing-msw"`
 */

export { default as workerDefault, worker } from "./browser.js";
export { getAllHandlers, restHandlers } from "./handlers/index.js";
export { API_URL, DEFAULT_API_URL, SERVICE_WORKER_PATH } from "./lib/constants.js";
export { mockPortfolios, mockPosts } from "./lib/mocks.js";
export type { ApiError, Portfolio, PortfolioImage, Post } from "./lib/types.js";
export { default as serverDefault, server } from "./server.js";
