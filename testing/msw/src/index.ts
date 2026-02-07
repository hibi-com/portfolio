/**
 * MSW (Mock Service Worker) の設定とハンドラーを提供するパッケージ
 *
 * 使用方法:
 * - Node.js環境（Vitestなど）: `import { server } from "@portfolio/testing-msw"`
 * - ブラウザ環境（Storybookなど）: `import { worker } from "@portfolio/testing-msw/browser"`
 * - ハンドラーのみ: `import { restHandlers } from "@portfolio/testing-msw"`
 */

export { default as workerDefault, worker } from "./browser";
export { restHandlers } from "./handlers/rest";
export { default as server } from "./server";
export * from "./types";
