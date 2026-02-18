---
name: sync-docs
description: 実装コードとドキュメントの差異を調査し、ドキュメントを実装に合わせて更新する。仕様書のメンテナンスに使用
argument-hint: "[対象ディレクトリ: sequence|specs|user-stories|architecture|development|skills]（省略時は全体）"
---

# ドキュメント同期（実装との整合性チェック）

プロジェクトの仕様ドキュメントを実装コードと比較し、差異を修正します。

## 対象ドキュメント構造

```text
docs/
├── sequence/           # シーケンス図（実装フロー）
│   ├── api/           # APIエンドポイント別
│   ├── web/           # Webフロントエンド
│   └── admin/         # 管理画面
├── specs/             # API・DB仕様書
│   ├── api/           # API仕様
│   └── db/            # DB仕様
├── user-stories/      # ユーザーストーリー
├── architecture/      # アーキテクチャ設計
└── development/       # 開発ガイドライン ← スキルが参照

.claude/skills/        # スキルファイル（docs/development/を参照）
```

## 引数による対象指定

| 引数 | 対象ディレクトリ | 対応する実装 |
| ---- | ---------------- | ------------ |
| `sequence` | `docs/sequence/` | `apps/api/src/`, `apps/web/`, `apps/admin/` |
| `specs` | `docs/specs/` | `apps/api/src/interface/rest/`, `packages/db/prisma/schema/` |
| `user-stories` | `docs/user-stories/` | `apps/web/e2e/large/`, `apps/admin/e2e/` |
| `architecture` | `docs/architecture/` | プロジェクト全体構成 |
| `development` | `docs/development/` | 開発規約・ツール設定 |
| `skills` | `.claude/skills/` | `docs/development/` との整合性 |
| （省略） | `docs/` 全体 + `.claude/skills/` | 全実装コード |

## スキル↔ドキュメント整合性チェック

`skills` 引数または省略時に実行されます。

### チェック対象マッピング

| スキル | 参照ドキュメント |
| ------ | ---------------- |
| `/commit` | `docs/development/git-commit.md` |
| `/pr` | `docs/development/git-commit.md`, `ci-cd-tools.md` |
| `/review` | `docs/development/coding-standards.md` |
| `/build` | `docs/development/deployment.md`, `monorepo-management.md` |
| `/lint` | `docs/development/coding-standards.md` |
| `/format` | `docs/development/coding-standards.md` |
| `/typecheck` | `docs/development/coding-standards.md` |
| `/unit-test` | `docs/testing/testing-strategy.md`, `testing-guide.md` |
| `/integration-test` | `docs/testing/testing-strategy.md`, `testing-guide.md` |
| `/e2e-test` | `docs/testing/testing-strategy.md`, `testing-guide.md`, `docs/development/e2e-docker.md` |
| `/db-migrate` | `docs/development/database.md` |
| `/gen-mock` | `docs/testing/testing-guide.md` |
| `/sequence-diagram` | `docs/development/api-design.md` |

### チェック項目

1. **リンク有効性**: 参照ドキュメントが存在するか
2. **内容整合性**: スキルの説明とドキュメントの内容が矛盾していないか
3. **コマンド整合性**: スキルに記載のコマンドが実際のpackage.jsonスクリプトと一致するか

### スキル整合性チェック手順

```bash
# 1. 各スキルの参照ドキュメントを抽出
grep -r "docs/development" .claude/skills/*/SKILL.md

# 2. 参照先ファイルの存在確認
ls docs/development/

# 3. 差異がある場合は報告
```

## 標準チェック項目

### シーケンス図 (`docs/sequence/`)

| チェック | 実装参照先 |
| -------- | ---------- |
| エンドポイントパス | `apps/api/src/interface/rest/*.ts` |
| リクエスト/レスポンス形式 | `packages/validation/src/` |
| UseCase呼び出しフロー | `apps/api/src/application/usecases/` |
| Repository操作 | `apps/api/src/infrastructure/repositories/` |

### API仕様書 (`docs/specs/api/`)

| チェック | 実装参照先 |
| -------- | ---------- |
| エンドポイント一覧 | `apps/api/src/interface/rest/` |
| HTTPメソッド・パス | Honoルーター定義 |
| バリデーションルール | `packages/validation/src/` |
| エラーレスポンス | `apps/api/src/interface/error-handler.ts` |

### DB仕様書 (`docs/specs/db/`)

| チェック | 実装参照先 |
| -------- | ---------- |
| テーブル定義 | `packages/db/prisma/schema/*.prisma` |
| リレーション | Prismaスキーマの `@relation` |
| インデックス | Prismaスキーマの `@@index` |

### ユーザーストーリー (`docs/user-stories/`)

| チェック | 実装参照先 |
| -------- | ---------- |
| シナリオの実装状態 | `apps/web/e2e/large/`, `apps/admin/e2e/` |
| 受け入れ条件 | E2Eテストのアサーション |

## 作業手順

1. **差異調査**: Exploreエージェントでドキュメントと実装の差異を網羅的に調査
2. **差異一覧作成**: 発見した差異をカテゴリ別（クリティカル/中/低）にまとめる
3. **修正実行**: Editツールでドキュメントを修正
4. **サマリー報告**: 変更内容を報告

## 差異の優先度基準

| 優先度 | 説明 | 例 |
| ------ | ---- | -- |
| **クリティカル** | 実装と完全に矛盾 | エンドポイントパスの相違、存在しないファイル参照、リンク切れ |
| **中** | 情報の欠落・不足 | 新規追加されたパラメータ未記載 |
| **低** | 表記揺れ・軽微な差異 | バージョン番号、フォーマット |

## 修正方針

- **実装が正**: ドキュメントを実装に合わせて修正
- **未実装機能**: `## 今後の拡張` セクションに移動
- **削除された機能**: ドキュメントから削除（履歴はgitで管理）
- **リンク切れ**: スキルの参照ドキュメントを修正または新規ドキュメント作成

## 出力例

```markdown
## sync-docs 実行結果

### クリティカル（即修正）
- [ ] `docs/sequence/api/crm/customer-create.md`: エンドポイント `/api/crm/customers` → `/api/customers` に修正
- [ ] `.claude/skills/build/SKILL.md`: 参照先 `docs/development/deployment.md` が存在しない

### 中（要確認）
- [ ] `docs/specs/api/post.md`: `publishedAt` パラメータの記載漏れ
- [ ] `.claude/skills/unit-test/SKILL.md`: カバレッジ閾値の記載が `docs/development/testing.md` と異なる

### 低（任意）
- [ ] `docs/architecture/overview.md`: Node.jsバージョン 20.x → 22.x

### スキル↔ドキュメント整合性
| スキル | 参照ドキュメント | 状態 |
| ------ | ---------------- | ---- |
| `/commit` | `git-commit.md` | ✅ |
| `/lint` | `coding-standards.md` | ✅ |
| `/build` | `deployment.md` | ⚠️ 内容不一致 |
```
