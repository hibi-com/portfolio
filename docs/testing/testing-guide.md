---
title: "テストガイドライン"
---

このプロジェクトでは、コード品質を保証するために包括的なテスト戦略を採用しています。

## テスト戦略

### テストハニカム戦略

本プロジェクトでは、[Spotify Testing Honeycomb](https://engineering.atspotify.com/2018/01/testing-of-microservices) に基づくテスト戦略を採用しています。

> **"最も複雑なのはサービス内部ではなく、他とのインタラクション"**
>
> — Spotify Engineering

従来のテストピラミッドとは異なり、**Integration Tests（Medium Tests）を最も重視**する（Large は最小限・Small は限定的な逆ピラミッド）。

#### テスト優先順位

| 優先度 | テストタイプ | 説明 |
| ------ | ----------- | ---- |
| ⭐⭐⭐ | **Medium Tests** | サービス間インタラクションの検証。シーケンス図と1:1対応 |
| ⭐ | Small Tests | 複雑なビジネスロジックに限定。単純なCRUD/委譲は不要 |
| ⚠️ | Large Tests | クリティカルパスのみ。外部依存は壊れやすいため最小限に |

#### なぜMedium Testsを重視するのか

1. **複雑性の所在**: マイクロサービスの複雑性はサービス内部ではなく、相互作用にある
2. **Small Testsの問題**: 実装詳細に依存し、コード変更時にテストも変更が必要になりがち
3. **Large Testsの問題**: 外部サービスに依存し、脆弱で壊れやすい

#### Small Testを書くべきケース

| ✅ 書くべき | ❌ 書かない |
| ---------- | ----------- |
| 複雑なビジネスロジック（計算、変換、解析） | 単純なCRUD操作 |
| 多くの分岐を持つ関数 | 他への委譲だけの薄いラッパー |
| 自然に隔離されたユーティリティ関数 | フレームワーク機能を呼ぶだけのコード |
| エッジケースが多い処理 | 実装の詳細に依存するテスト |

テストサイズの分類・実行時間・ドキュメント対応・カバレッジ目標は [テスト戦略](./testing-strategy.md) を参照。

### テストサイズの定義

#### Small Tests（単体テスト）

- **目的**: 個別の関数、クラス、コンポーネントの動作検証
- **特徴**:
  - 単一プロセスで実行
  - 外部依存関係は完全にモック化
  - ネットワークアクセスなし
  - ファイルシステムアクセスなし
- **対象**: UseCase、Repository（モック）、ユーティリティ関数、Reactコンポーネント
- **フレームワーク**: Vitest

#### Medium Tests（統合テスト）

- **目的**: 複数コンポーネント間の連携と仕様書（シーケンス図）の検証
- **特徴**:
  - 複数プロセス可
  - 外部サービス（API等）はモック化
  - テスト用データベース接続可
  - **シーケンス図と1:1で対応**
- **対象**: REST API統合、UseCase→Repository→DB連携、ミドルウェア統合
- **フレームワーク**: Vitest + テストDB

#### Large Tests（E2Eテスト）

- **目的**: ユーザーストーリーに基づくシステム全体の動作検証
- **特徴**:
  - 実システム全体を使用
  - ブラウザシミュレーション含む
  - **ユーザーストーリーと1:1で対応**
- **対象**: ユーザーシナリオ、クリティカルパス、リグレッション
- **フレームワーク**: Playwright

### テストファイル命名規則

| サイズ | 命名規則 | 配置場所 | 例 |
| ----- | ------- | ------- | --- |
| Small | `*.test.ts` | ソースファイルと同階層 | `getPosts.test.ts` |
| Medium | `*.medium.test.ts` | `tests/medium/` | `posts-list.medium.test.ts` |
| Large | `*.large.spec.ts` | `e2e/large/` | `browse-blog.large.spec.ts` |

### テストと仕様書の対応

#### Medium Tests とシーケンス図

Medium Tests は `docs/sequence/api/` 内のシーケンス図と1:1で対応します。

Medium Tests はシーケンス図（`docs/sequence/`）と1:1で対応する。  
テストファイルの冒頭には、対応するシーケンス図へのリンクを JSDoc（`@sequence`, `@description`）で記載する。  
配置・実装例はリポジトリの `tests/medium/` を参照。

#### Large Tests とユーザーストーリー

Large Tests は `docs/user-stories/` 内のユーザーストーリーと1:1で対応する。  
配置・実装例はリポジトリの `e2e/large/` を参照。

## 単体テスト

### テストファイルの配置

テストファイルは、テスト対象のファイルと同じディレクトリに配置する。  
配置例はリポジトリを参照。

### Small Testsの書き方

- **関数のテスト**: describe / it で正常系・異常系を検証。実装例はリポジトリの `*.test.ts` を参照。
- **Reactコンポーネントのテスト**: Testing Library で render / screen を用いて表示・リンクを検証。実装例はリポジトリを参照。
- **Remixローダーのテスト**: loader に request / params を渡し、レスポンスまたは throw を検証。実装例はリポジトリを参照。

### テストユーティリティ

共通のセットアップは `testing/vitest/` に配置されている（`@testing-library/jest-dom`, cleanup 等）。  
詳細はリポジトリを参照。

### カバレッジ設定

カバレッジレポートは次の設定で生成されます。

- **レポート形式**: HTML, LCOV
- **閾値**: 90%（lines, functions, statements）、100%（branches）
- **除外**: `.cache/`, `node_modules/`, `**/*.test.{ts,tsx}`, `**/*.config.{ts,js}`
- **出力先**: `apps/e2e/public/reports/coverage/{project}/`（Test Portalで表示）

実行: `bun run coverage`。  
特定パッケージは `turbo run coverage --filter=@portfolio/...`。  
詳細はルートの `package.json` を参照。

## 統合テスト

### ディレクトリ構造

API の Medium Tests は `apps/api/tests/medium/` に setup とドメイン別テストを配置する。  
構造・実装例はリポジトリを参照。

### Medium Testsの書き方

Medium Tests はシーケンス図の各ステップを Given/When/Then で検証する。  
DB 初期化・DI コンテナ・seed の利用例はリポジトリの `tests/medium/` を参照。

### Medium Tests実行コマンド

`bun run integration`。  
特定ドメインは `--filter` で指定。  
詳細は `package.json` を参照。

## Integration Tests（Web/Admin）

フロントエンドアプリケーション（web/admin）のIntegration Testsは、Remixローダー/TanStack Routerとコンポーネントの統合を検証する。  
MSW で API をモックする。  
配置・実装例はリポジトリの `integration/` を参照。

### シーケンス図との対応

| シーケンス図 | Integration Test |
| ----------- | ---------------- |
| `docs/sequence/web/blog-list.md` | `apps/web/integration/blog-list.integration.test.ts` |
| `docs/sequence/web/blog-detail.md` | `apps/web/integration/blog-detail.integration.test.ts` |
| `docs/sequence/admin/posts/posts-list.md` | `apps/admin/integration/posts-list.integration.test.tsx` |

実行コマンド: `bun run integration`。  
詳細は `package.json` を参照。

## E2Eテスト

### Large の構成

ユーザーストーリーベースの Large Tests は `e2e/large/` にペルソナ別に配置する。  
API 検証・accessibility・visual・interactions 用のディレクトリもある。  
配置はリポジトリを参照。

### ページオブジェクトモデル（POM）

E2E ではページオブジェクトモデルを採用する。  
各ページで `goto` / `expect*` / `click*` などのメソッドを定義する。  
実装例はリポジトリの `e2e/pages/` を参照。

### ユーザーストーリーベースのテスト

Large Tests は Given/When/Then でユーザーストーリーのシナリオを検証する。  
実装例はリポジトリの `e2e/large/` を参照。

### APIテスト

API エンドポイントのレスポンス検証は `request.get()` 等で行う。  
実装例はリポジトリの `e2e/api/` を参照。

## テスト実行

### ローカル環境

主なコマンド: `bun run test`（Small）, `bun run integration`（Medium）, `bun run e2e`（Large）, `bun run coverage`。  
その他はルートおよび各アプリの `package.json` を参照。

### CI環境

CI では Docker コンテナ内で E2E を実行する。  
手順は `package.json` の e2e スクリプトおよび CI 設定を参照。

## テストのベストプラクティス

### 1. テストの独立性

各テストは他に依存せず単体で実行可能にする。

### 2. 明確なテスト名

何を検証しているか分かる名前にする（例: `should return 404 when blog post does not exist`）。  
`should work` のような曖昧な名前は避ける。

### 3. AAAパターン

Arrange（準備）→ Act（実行）→ Assert（検証）の順で整理する。

### 4. モックの適切な使用

外部依存（API 等）は vi.fn() や MSW でモックし、テスト内で結果と呼び出しを検証する。

### 5. エッジケースのテスト

正常系に加え、不正入力・null・空文字などエッジケースもカバーする。

## テストカバレッジ

カバレッジの数値目標（Lines/Functions/Branches/Statements）は [テスト戦略](./testing-strategy.md) を参照。

### MC/DC（Modified Condition/Decision Coverage）

MC/DCは航空・医療・自動車など安全性が重要なシステムで採用されるカバレッジ基準です。

#### MC/DCの3つの要件

1. **エントリ/エグジット網羅**: すべてのエントリポイントとエグジットポイントが呼び出される
2. **条件網羅**: 判定内のすべての条件がtrue/falseの両方を取る
3. **独立影響**: 各条件が独立して判定の結果に影響を与える

#### MC/DCテストパターン

複合条件では、各条件が単独で判定結果に影響するケースをテストする。  
条件 A の独立影響なら「B,C を固定して A だけ true/false を切り替え、結果が変わること」を検証する。  
実装例はリポジトリを参照。

#### MC/DC真理値表

| A | B | C | A && B | A && B \|\| C | Aの影響 | Bの影響 | Cの影響 |
| - | - | - | ------ | ------------- | ------- | ------- | ------- |
| T | T | F | T | T | ✓ | ✓ | |
| F | T | F | F | F | ✓ | | |
| T | F | F | F | F | | ✓ | |
| F | F | T | F | T | | | ✓ |
| F | F | F | F | F | | | ✓ |

### 実践的なMC/DCガイドライン

#### 1. 複合条件の分解

複雑な `if (A && B && C)` は、`isAdminUser` / `hasAccess` / `isNotBanned` のように意味のある変数に分解し、各条件を独立してテストしやすくする。

#### 2. 早期リターンの活用

ガード句で早期 return すると、各条件を個別のテストで検証しやすい。

#### 3. ガード句のテスト

baseUser / baseConfig を固定し、1条件だけ変えたケースで「拒否」「許可」を検証する。  
実装例はリポジトリを参照。

### カバレッジレポートの確認

カバレッジレポートは `apps/e2e/public/reports/coverage/` に出力される。Test Portal（`apps/e2e` で `bun run dev`）の `/coverage` で確認可能。  
特定パッケージは `bun run coverage --filter=...`。  
詳細は `package.json` を参照。

### カバレッジ除外

除外したい行には `/* istanbul ignore next */` または `/* istanbul ignore if */` を付与する。  
詳細は Vitest のドキュメントを参照。

## 独立したE2Eテスト（apps/e2e）

本番環境に対して実行する独立したE2Eテストは `apps/e2e` パッケージで管理します。

### アクセシビリティテスト

WCAG準拠とキーボードナビゲーションを検証します。

| ファイル | 検証内容 |
| -------- | -------- |
| `navigation.spec.ts` | ナビゲーションのアクセシビリティ |
| `keyboard.spec.ts` | キーボードナビゲーション、フォーカス管理 |
| `images.spec.ts` | 画像のalt属性 |
| `forms.spec.ts` | フォームラベル |
| `semantic.spec.ts` | 見出し階層、ARIAランドマーク、スキップリンク |
| `labels.spec.ts` | ボタン/リンクのラベル |
| `contrast.spec.ts` | 色のコントラスト |

実行: `apps/e2e` で `bun run accessibility:web:prd`。  
詳細は `package.json` を参照。

### モンキーテスト

ランダム操作による安定性テストです。

| ファイル | 検証内容 |
| -------- | -------- |
| `interactions.spec.ts` | ランダムなクリック、入力、スクロール |
| `navigation.spec.ts` | 高速なページ遷移 |
| `mouse.spec.ts` | ランダムなマウス操作 |

実行: `apps/e2e` で `bun run monkey:web:prd`。  
詳細は `package.json` を参照。

### Page Object Model（POM）

E2E ではページオブジェクトを import し、goto / click / expect でシナリオを記述する。  
実装例はリポジトリの `e2e/pages/` を参照。

| ページオブジェクト | 対象ページ |
| ----------------- | ---------- |
| `HomePage` | トップページ |
| `BlogPage` | ブログページ |
| `PortfolioPage` | ポートフォリオページ |
| `ResumePage` | 履歴書ページ |
| `UsesPage` | Usesページ |

## 参考資料

- [Google Testing Blog - Test Sizes](https://testing.googleblog.com/2010/12/test-sizes.html)
- [Spotify Testing Honeycomb](https://engineering.atspotify.com/2018/01/testing-of-microservices)
- [Vitest公式ドキュメント](https://vitest.dev/)
- [Playwright公式ドキュメント](https://playwright.dev/)
- [Testing Library公式ドキュメント](https://testing-library.com/)
- [Page Object Modelパターン](https://playwright.dev/docs/pom)
