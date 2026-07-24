# Fix testing-msw build + verify with bun install / check

## 対応

1. `@portfolio/testing-msw` — `tsconfig.json` に `lib: ["DOM", "DOM.Iterable", "ES2022"]` を追加（`browser.ts` の `window`/`document`）
2. `testing/msw/package.json` — syncpack 向けに exports キー順を整理
3. `@portfolio/web` — `createApiClient` で明示 `apiUrl` を優先；clipboard テストの mock パスを `~/shared/lib/logger` に修正
4. 壊れた nested `esbuild`（Docker xattr 付きバイナリ）を削除してホストで再インストール → wiki/scenario vite build 復旧

## 検証

- `bun install` → EXIT 0
- `bun run check` → EXIT 0（fmt / lint / typecheck / test / knip）
