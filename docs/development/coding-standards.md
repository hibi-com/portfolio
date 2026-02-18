---
title: "コーディング規約"
description: プロジェクトで守るべき厳格なコーディング規約
---

## コーディング規約

このプロジェクトで**守らなければならない**コーディング規約。

## IMPORTANT: 規約の遵守レベル

本ドキュメントでは以下のキーワードで遵守レベルを明示します：

| キーワード | 意味 | 違反時の対応 |
| ---------- | ---- | ------------ |
| **MUST** / **必須** | 絶対に守らなければならない | **PRブロック、即修正** |
| **MUST NOT** / **禁止** | 絶対にしてはならない | **PRブロック、即修正** |
| **SHOULD** / **推奨** | 守ることを強く推奨 | レビュー時に指摘 |
| **MAY** / **任意** | 実装者の判断に委ねる | 指摘なし |

## 禁止事項（MUST NOT）

以下は**絶対に禁止**。違反したコードは**即却下**。

### ❌ ディレクトリ・ファイル命名

| 禁止項目 | 理由 | 代替 |
| -------- | ---- | ---- |
| `utils/` ディレクトリ | 曖昧で責任範囲が不明確 | `lib/`, `shared/`, `helpers/` 等、明確な名前を使用 |
| `common/` ディレクトリ | 何でも入れられてしまう | 用途に応じて `shared/`, `lib/`, `types/` 等に分割 |
| `misc/` ディレクトリ | 「その他」は設計の放棄 | 適切なカテゴリに分類 |

**違反例**:

```text
❌ src/utils/helpers.ts
❌ src/common/stuff.ts
❌ src/misc/things.ts
```

**正しい例**:

```text
✅ src/lib/date-formatter.ts
✅ src/shared/types/user.ts
✅ src/helpers/string-utils.ts
```

### ❌ エディタ・ツール

| 禁止項目 | 理由 |
| -------- | ---- |
| `vim`, `nano`, `emacs` | シェルがフリーズし、作業が中断される |
| `less`, `more`, `tail -f` | インタラクティブモードでシェルが停止 |

**代替**: `cat`, `head`, `tail -n`、または Read ツールを使用。

### ❌ Git操作

| 禁止項目 | 理由 | 例外 |
| -------- | ---- | ---- |
| `git push --force` | 他人の作業を破壊 | ユーザーが明示的に許可した場合のみ |
| `git push --force-with-lease` | main/master ブランチへは禁止 | feature ブランチのみ許可 |
| `git reset --hard origin/main` | ローカル変更が失われる | 事前にユーザー確認 |
| `git clean -fd` | 未追跡ファイルが削除される | 事前にユーザー確認 |
| `git commit --amend` | 既存コミットの破壊 | **pre-commit hook 失敗後は絶対禁止**（新規コミット作成） |

**CRITICAL**: pre-commit hook失敗後は`--amend`禁止。新規コミットを作成すること。

### ❌ コード品質

| 禁止項目 | 理由 | 検出方法 |
| -------- | ---- | -------- |
| 認証情報のハードコード | セキュリティリスク | `bun run lint`、コードレビュー |
| `any` 型の使用 | 型安全性の喪失 | `bun run typecheck` |
| `console.log` の残存（本番コード） | デバッグコードの混入 | `bun run lint` |
| `@ts-ignore` / `@ts-expect-error` の乱用 | 型エラーの隠蔽 | コードレビュー |
| マジックナンバー | 意図が不明確 | コードレビュー |

**違反例**:

```typescript
❌ const apiKey = "sk_live_abcdef123456"; // ハードコード
❌ function process(data: any) { ... }    // any型
❌ console.log("debug", user);            // console.log
❌ // @ts-ignore                          // 型エラー隠蔽
❌ if (user.age < 18) { ... }             // マジックナンバー
```

**正しい例**:

```typescript
✅ const apiKey = import.meta.env.VITE_API_KEY;
✅ function process(data: UserData): ProcessedData { ... }
✅ logger.debug("User processed", { userId: user.id });
✅ // 型エラーは解決する（隠蔽しない）
✅ const ADULT_AGE = 18; if (user.age < ADULT_AGE) { ... }
```

### ❌ インポート

| 禁止項目 | 理由 | 代替 |
| -------- | ---- | ---- |
| 循環依存 | ビルドエラー、実行時エラー | 依存関係を見直し、共通部分を抽出 |
| 上位レイヤーへの依存（DDD/FSD） | アーキテクチャ違反 | レイヤー順守（Domain → UseCase → Infrastructure → Interface） |
| 相対パスの深いネスト | 可読性低下、リファクタリング困難 | エイリアス使用（`~/`、`@/`） |

**違反例**:

```typescript
❌ import { User } from "../../../entities/user"; // 深い相対パス
❌ import { UserProfile } from "~/features/user-profile"; // entities が features に依存（FSD違反）
❌ import { PrismaClient } from "@prisma/client"; // Domain層で直接インポート（DDD違反）
```

**正しい例**:

```typescript
✅ import { User } from "~/entities/user"; // エイリアス使用
✅ import { User } from "~/entities/user"; // features が entities に依存（OK）
✅ import { UserRepository } from "~/infrastructure/repositories"; // Repository経由
```

## 必須項目（MUST）

以下は**必ず守る**こと。違反は**PRブロック対象**。

### ✅ 命名規則

| 対象 | 規則 | 例 |
| ---- | ---- | -- |
| ファイル名 | ケバブケース | `user-service.ts`, `api-client.ts` |
| Reactコンポーネント | PascalCase（ファイル名・クラス名） | `UserProfile.tsx`, `BlogPost.tsx` |
| クラス・型・インターフェース | PascalCase | `User`, `PostData`, `IUserRepository` |
| 関数・変数 | camelCase、動詞始まり | `handleClick`, `getUserById`, `isActive` |
| 定数 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| プライベートメンバー | アンダースコアプレフィックス | `_internalState`, `_privateMethod` |
| テストファイル | `*.test.ts` または `*.spec.ts` | `user-service.test.ts`, `login.spec.ts` |

**関数名の動詞プレフィックス**:

- `get` - データ取得
- `set` - データ設定
- `is` / `has` / `can` - 真偽値を返す
- `handle` - イベントハンドラ
- `create` / `update` / `delete` - CRUD操作
- `fetch` - 非同期データ取得
- `validate` - バリデーション

**Props型の命名**:

```typescript
✅ interface UserProfileProps { ... }
✅ type ButtonProps = { ... }
```

### ✅ フォーマット（Biome）

**必須設定** - `biome.json`に定義:

- **インデント**: スペース2つ（MUST）
- **行幅**: 120文字（MUST）
- **セミコロン**: 必須（MUST）
- **クォート**: ダブルクォート（MUST）
- **末尾カンマ**: あり（MUST）
- **アロー関数**: 引数に括弧を付ける（MUST）

**違反例**:

```typescript
❌ const user = {name: 'John'}  // セミコロンなし、シングルクォート
❌ const fn = x => x * 2        // 括弧なし
```

**正しい例**:

```typescript
✅ const user = { name: "John" };
✅ const fn = (x) => x * 2;
```

**フォーマット確認**:

```bash
# 必ずコミット前に実行
bun run fmt:check  # フォーマット確認
bun run fmt        # 自動修正
```

### ✅ インポート順序

**必須順序**:

1. 外部ライブラリ（React, Remix等）
2. 内部モジュール（`~/shared`, `~/features`等）
3. 相対インポート（`./`, `../`）
4. 型のみのインポート（`import type`）

**正しい例**:

```typescript
// 1. 外部ライブラリ
import { useState } from "react";
import { json } from "@remix-run/node";

// 2. 内部モジュール
import { Button } from "~/shared/ui/button";
import { useAuth } from "~/features/auth";

// 3. 相対インポート
import { helper } from "./helper";

// 4. 型のみ
import type { User } from "~/entities/user";
```

### ✅ TypeScript

**必須設定**:

- `strict: true` - 厳格モード有効化（MUST）
- `noImplicitAny: true` - 暗黙のanyを禁止（MUST）
- `strictNullChecks: true` - null/undefinedチェック（MUST）

**型定義**:

- `any`型は**絶対禁止**（MUST NOT）
- 公開API・イベントハンドラには**明示的な型**を付ける（MUST）
- Props型はコンポーネントと同じファイルで定義（MUST）

**違反例**:

```typescript
❌ function process(data: any) { ... }              // any禁止
❌ const onClick = (e) => { ... }                   // 暗黙のany
❌ export function api(params) { ... }              // 公開APIに型なし
```

**正しい例**:

```typescript
✅ function process(data: UserData): ProcessedData { ... }
✅ const onClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... }
✅ export function api(params: ApiParams): Promise<ApiResponse> { ... }
```

### ✅ エラーハンドリング

**必須要件**:

- すべての非同期処理に`try-catch`（MUST）
- エラーは`AppError`クラスで統一（MUST）
- ログ出力必須（`logger.error`）（MUST）

**違反例**:

```typescript
❌ async function fetchUser(id: string) {
  const user = await api.get(`/users/${id}`); // try-catchなし
  return user;
}
```

**正しい例**:

```typescript
✅ async function fetchUser(id: string): Promise<User> {
  try {
    const user = await api.get(`/users/${id}`);
    return user;
  } catch (error) {
    logger.error("Failed to fetch user", { userId: id, error });
    throw new AppError("USER_FETCH_FAILED", "ユーザー取得に失敗しました", 500);
  }
}
```

### ✅ コメント

**必須要件**:

- 複雑なロジックには説明コメント（MUST）
- 公開APIにはJSDoc（MUST）
- WHYを書く（WHATは不要）（MUST）

**禁止**:

- 自明なコードへのコメント（MUST NOT）
- コメントアウトされたコード（MUST NOT）

**違反例**:

```typescript
❌ // ユーザーを取得する
const user = await getUser(id);

❌ // const oldCode = () => { ... }; // 古いコード
```

**正しい例**:

```typescript
✅ // IMPORTANT: キャッシュをクリアしないとメモリリーク発生
clearCache();

✅ /**
 * ユーザーを認証する
 * @param email - ユーザーのメールアドレス
 * @param password - パスワード（ハッシュ化前）
 * @returns 認証トークン
 * @throws {AppError} 認証失敗時
 */
export async function authenticate(email: string, password: string): Promise<string> { ... }
```

## 推奨項目（SHOULD）

守ることを**強く推奨**。違反時はレビューで指摘。

### 関数の長さ

- 1関数あたり**50行以内**を推奨
- 100行を超える場合は分割を検討

### ネストの深さ

- **3階層以内**を推奨
- 早期リターンを使用

**推奨例**:

```typescript
// ✅ 推奨: 早期リターン
function process(user: User | null) {
  if (!user) return;
  if (!user.isActive) return;
  if (!user.hasPermission("admin")) return;

  // メイン処理
}

// ⚠️ 非推奨: 深いネスト
function process(user: User | null) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission("admin")) {
        // メイン処理
      }
    }
  }
}
```

### DRY原則

- 同じコードが**3回以上**出現したら共通化

## コミット前チェックリスト

**必ず実行**（すべてパスしなければコミット不可）:

```bash
# 1. フォーマット確認
bun run fmt:check
# → 失敗した場合: bun run fmt で自動修正

# 2. リント確認
bun run lint
# → エラーがある場合: 手動修正

# 3. 型チェック
bun run typecheck
# → 型エラーがある場合: 手動修正

# 4. テスト実行
bun run test
# → 失敗した場合: テスト修正

# 5. ビルド確認
bun run build
# → ビルドエラーがある場合: 修正
```

**すべてパスしたらコミット可能**:

```bash
git add .
git commit -m "feat: 新機能追加"
```

## 自動検証

以下のコマンドで自動検証が実行されます:

```bash
# 全チェックを一括実行
bun run validate

# 個別実行
bun run fmt:check    # フォーマット
bun run lint         # リント
bun run typecheck    # 型チェック
bun run test         # テスト
bun run coverage     # カバレッジ
```

## 違反時の対応

| 違反レベル | 対応 |
| ---------- | ---- |
| **MUST NOT違反** | **即却下**。PRはマージ不可。即座に修正。 |
| **MUST違反** | **PRブロック**。修正後に再レビュー。 |
| **SHOULD違反** | レビュー時に指摘。次回以降は修正。 |

## 例外規定

**原則として例外は認めない**。

やむを得ず例外が必要な場合:

1. **理由をコメントで明記**（MUST）
2. **レビュアーの承認を得る**（MUST）
3. **Issue番号を記載**（MUST）

```typescript
// EXCEPTION: #1234 - パフォーマンス最適化のためanyを使用
// TODO: 型定義を追加する（期限: 2026-03-01）
// @ts-expect-error - 外部ライブラリの型定義が不完全
const data: any = externalLibrary.getData();
```

## 関連ドキュメント

| ドキュメント | 説明 |
| ------------ | ---- |
| [コードレビューガイド](./code-review.md) | レビュー観点、良い例・悪い例 |
| [テスト戦略](../testing/testing-strategy.md) | テストハニカム、カバレッジ基準 |
| [セキュリティガイドライン](../security/guidelines.md) | OWASP対応、機密情報管理 |
| [API設計原則](./api-design-principles.md) | REST API設計ガイドライン |
| [DDD実践ガイド](../architecture/ddd-guide.md) | ドメイン駆動設計の実装パターン |
| [FSD実践ガイド](../architecture/fsd-guide.md) | Feature-Sliced Design実装パターン |

## 更新履歴

| 日付 | 変更内容 | 担当 |
| ---- | -------- | ---- |
| 2026-02-19 | 厳格化: MUST/SHOULD明確化、禁止事項拡充 | - |
| 2024-02-19 | 初版作成 | - |
