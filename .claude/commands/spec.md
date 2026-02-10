# 仕様書作成コマンド

仕様書（シーケンス図、API仕様、DB仕様、ユーザーストーリー）を作成します。

## 使用方法

```text
/spec [タイプ] [対象]
```

### タイプ

| タイプ | 説明 | 出力先 |
| ------ | ---- | ------ |
| `sequence` | シーケンス図 | `docs/sequence/` |
| `api` | API仕様書 | `docs/specs/api/` |
| `db` | DB仕様書 | `docs/specs/db/` |
| `story` | ユーザーストーリー | `docs/user-stories/` |

## シーケンス図作成

**使用エージェント**: `spec-writer-agent`
**使用テンプレート**: `.claude/templates/sdd/sequence-diagram.md`
**使用スキル**: `/sequence-diagram`
**参照ルール**: `.claude/rules/sequence.md`

### シーケンス図の手順

1. テンプレートを読み込む
2. 対象コードを分析
3. シーケンス図を作成

```bash
# テンプレート確認
cat .claude/templates/sdd/sequence-diagram.md

# 対象コード確認
cat apps/api/src/interface/rest/{domain}.ts
cat apps/api/src/application/usecases/{domain}/
```

### シーケンス図の出力先

```text
docs/sequence/api/{domain}/{operation}.md
docs/sequence/web/{feature}/{page}.md
docs/sequence/admin/{feature}/{page}.md
```

## API仕様書作成

**使用エージェント**: `spec-writer-agent`
**使用テンプレート**: `.claude/templates/sdd/api-spec.md`
**参照ルール**: `.claude/rules/api.md`

### API仕様書の手順

1. テンプレートを読み込む
2. エンドポイントを分析
3. 仕様書を作成

### API仕様書の出力先

```text
docs/specs/api/{domain}.md
```

## DB仕様書作成

**使用エージェント**: `spec-writer-agent`, `db-migration-agent`
**使用テンプレート**: `.claude/templates/sdd/db-spec.md`
**使用スキル**: `/db-migrate`

### DB仕様書の手順

1. テンプレートを読み込む
2. Prismaスキーマを分析
3. 仕様書を作成

```bash
# Prismaスキーマ確認
cat packages/db/prisma/schema/{domain}.prisma
```

### DB仕様書の出力先

```text
docs/specs/db/{domain}.md
```

## ユーザーストーリー作成

**使用エージェント**: `spec-writer-agent`
**使用テンプレート**: `.claude/templates/sdd/user-story.md`

### ユーザーストーリーの手順

1. テンプレートを読み込む
2. ペルソナと要件を整理
3. ストーリーを作成

### ユーザーストーリーの出力先

```text
docs/user-stories/{persona}/{story-name}.md
```

## 基本原則

**参照ルール**: `.claude/rules/spec-driven.md`

1. **コード絶対主義**: 実装コードを100%正確に反映
2. **簡略化禁止**: 既存コードの省略・簡略化は禁止
3. **捏造禁止**: 存在しないコードを追加しない
4. **明示的検証**: すべての矢印に対応するコードが必要

## 関連リソース

| 種類 | リソース |
| ---- | -------- |
| ルール | `spec-driven.md`, `sequence.md`, `api.md` |
| テンプレート | `sdd/sequence-diagram.md`, `sdd/api-spec.md`, `sdd/db-spec.md`, `sdd/user-story.md` |
| エージェント | `spec-writer-agent`, `db-migration-agent` |
| スキル | `/sequence-diagram`, `/db-migrate` |

## 出力フォーマット

```markdown
## 仕様書作成完了

### 作成ファイル
- パス: {path}
- タイプ: {type}

### 内容サマリー
{summary}

### 確認事項
- [ ] テンプレートに準拠
- [ ] コードと一致
- [ ] レビュー依頼
```
