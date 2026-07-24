# Trivy HIGH/CRITICAL 91件対応

## 結果

- Trivy: **HIGH/CRITICAL 0 / GATE_PASS**
- `bun run check`: 成功
- gitleaks: no leaks found

## 対応内容

### 直接依存の更新（抜粋）

- axios / better-auth / hono / vite / vitest / wrangler / react-router / remix / astro / sharp など

### overrides（間接依存）

ルート `package.json` の `overrides` で `tar` / `protobufjs` / `handlebars` / `brace-expansion@5.0.7` などを固定。

- `brace-expansion` は minimatch 10 互換のため **5.0.7**（2.1.2 固定は API 非互換で web build が壊れる）

### Astro 6 未移行

Cloudflare Pages では `@astrojs/cloudflare` v13（Workers）が必要。wiki は Astro 5.18.2 を維持し、以下を `.trivyignore` に残置:

- `CVE-2026-50146`
- `CVE-2026-54299`

### undici 5（旧 miniflare）

`vitest-environment-miniflare@2.14.4` 由来。cache/db テストは mock のみのため `environment: "node"` に切替し依存削除 → undici 5 解消。

### Hono 4.12 型修正

`c.req.param()` が `string | undefined` になったため、openapi ハンドラに `isValidUuid` / `isValidSlug` ガードを追加。

### workerd codesign

bun の hardlink で `workerd` の codesign が壊れ `SIGKILL (Code Signature Invalid)` → web build が EPIPE。バイナリ差し替え / 再インストールで復旧。
