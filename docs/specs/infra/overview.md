---
title: "インフラストラクチャ仕様書"
description: インフラの要件と仕様を定義
---

## インフラストラクチャ仕様書

本ドキュメントはインフラストラクチャの**仕様**を定義します。  
実際のアーキテクチャ図は`docs/architecture/infra-architecture.md`を参照してください（Pulumiから自動生成）。

## 仕様駆動のアプローチ

インフラの構成は以下の流れで管理します：

```text
仕様定義（手動） → 実装（Pulumi） → 構成図生成（自動）
   ↑                    ↑                    ↑
   本ドキュメント      infra/            docs/architecture/
```

1. **仕様定義**（本ドキュメント） - 要件と仕様を手動で記載
2. **実装**（`infra/`） - Pulumiで実装
3. **自動生成**（将来実装） - Pulumiから構成図を自動生成

### このドキュメントに書くべきこと

**✅ 記載すべき内容**:

- インフラの要件
- 非機能要件（パフォーマンス、可用性など）
- 制約事項
- コスト試算
- 環境構成
- 設計判断の理由

**❌ 記載不要な内容**:

- 実際のリソース構成図（Pulumiから自動生成）
- 現在のデプロイ状態（`pulumi stack`で確認）
- 具体的なリソース定義（`infra/`で実装）

### 構成図の自動生成

以下の情報はPulumiから自動生成されます：

- **ランタイム構成図** - ユーザーリクエストの流れ
- **プロビジョニング構成図** - Pulumiのリソース作成順序
- **リソース依存グラフ** - `pulumi stack graph` による依存関係

**再生成方法**:

```bash
cd infra
bun run generate:mermaid  # Mermaid図のみ生成
bun run generate          # Pulumi stack graph も含めて全て生成（要Pulumiログイン）
```

## 要件

### ホスティング環境

| 項目 | 要件 | 理由 |
| ---- | ---- | ---- |
| プラットフォーム | Cloudflare | エッジでの高速配信、グローバルCDN |
| デプロイ方法 | Pages（フロントエンド）、Workers（API） | サーバーレス、自動スケーリング |
| リージョン | グローバル（エッジ） | 低レイテンシ |

### データストア

| 項目 | 要件 | 理由 |
| ---- | ---- | ---- |
| データベース | Cloudflare D1 | Workers と同一エッジでの低レイテンシ、サーバーレス |
| キャッシュ | Cloudflare Workers KV | エッジキャッシュ・セッション |
| オブジェクトストレージ | Cloudflare R2（アプリ画像専用） | WebView 表示用画像。CI 成果物用途ではない |
| リージョン | Cloudflare グローバル | エッジ配信との一体運用 |

### セキュリティ

| 項目 | 要件 | 理由 |
| ---- | ---- | ---- |
| HTTPS | 必須（Cloudflare自動） | 通信の暗号化 |
| アクセス制限 | Cloudflare Access（rc/stg環境） | プレビュー環境の保護 |
| シークレット管理 | Cloudflare環境変数 | APIキーの安全な管理 |

### 可観測性

| 項目 | 要件 | 理由 |
| ---- | ---- | ---- |
| エラートラッキング | Sentry | エラー監視、デバッグ |

## アプリケーション構成

### フロントエンド（Cloudflare Pages）

| アプリ | サブドメイン（prd） | 説明 |
| ------ | ------------------- | ---- |
| Web | `www` | 公開サイト（Remix） |
| Admin | `admin` | 管理画面（TanStack Router） |
| Wiki | `wiki` | ドキュメント（Astro） |
| Portal | `portal` | E2E ポータル |

### バックエンド（Cloudflare Workers）

| アプリ | サブドメイン（prd） | 説明 |
| ------ | ------------------- | ---- |
| API | `api` | REST API（Hono + DDD） |

### ドメイン命名規則

ベースドメインは全環境で `ageha734.jp`。prd 以外は **環境プレフィックスをアプリ名の前** に付ける。

| 環境 | Web 例 | API 例 |
| ---- | ------ | ------ |
| `prd` | `www.ageha734.jp` | `api.ageha734.jp` |
| `rc` | `rc.www.ageha734.jp` | `rc.api.ageha734.jp` |
| `stg` | `stg.www.ageha734.jp` | `stg.api.ageha734.jp` |

### Service Binding

- Web → API
- Admin → API

## 環境とスタック

| 環境 | Pulumiスタック | 説明 | Cloudflare Access |
| ---- | -------------- | ---- | ----------------- |
| `prd` | `prd` | 本番環境 | なし |
| `stg` | `stg` | ステージング環境 | あり |
| `rc` | `rc` | リリース候補環境 | あり |

### 環境変数管理

- `infra/.env` - ローカル環境用
- Cloudflare環境変数 / Worker Bindings - 本番・ステージング用

## DNS構成

| レコード名（prd） | 種別 | 対象 |
| ----------------- | ---- | ---- |
| `www` | CNAME | Cloudflare Pages (web) |
| `admin` | CNAME | Cloudflare Pages (admin) |
| `wiki` | CNAME | Cloudflare Pages (wiki) |
| `portal` | CNAME | Cloudflare Pages (e2e) |
| `api` | Custom Domain | Cloudflare Workers (api) |

## プロバイダー

| プロバイダー | 用途 | 管理ツール |
| ------------ | ---- | ---------- |
| Cloudflare | ホスティング、DNS、CDN、D1、KV、R2 | Pulumi |
| Sentry | エラートラッキング | Pulumi |

## 非機能要件

### パフォーマンス

- **レスポンス時間**: 初回表示 < 2秒
- **TTI**: < 3秒
- **API**: レスポンス < 500ms

### 可用性

- **稼働率**: 99.9%以上（Cloudflareの SLA に依存）
- **障害検知**: Sentry でモニタリング

### スケーラビリティ

- **自動スケーリング**: Cloudflare Pages/Workers
- **データベース**: D1（サーバーレス）
- **キャッシュ**: Workers KV

## 制約事項

### Cloudflare Workers

- **実行時間**: 最大 30秒
- **メモリ**: 128MB
- **CPU**: 10ms〜50ms（無料プランの場合）

### Cloudflare D1

- **無料プラン**: アカウントあたり DB 数・ストレージに上限あり（プラン依存）

## コスト試算

### 想定トラフィック

- **月間PV**: 10,000
- **API呼び出し**: 50,000回/月

### 予想コスト

| サービス | プラン | コスト |
| -------- | ------ | ------ |
| Cloudflare Pages | Free | $0 |
| Cloudflare Workers | Free | $0 |
| Cloudflare D1 | Free | $0 |
| Cloudflare Workers KV | Free | $0 |
| Cloudflare R2 | Free | $0 |
| Sentry | Developer | $0 |

**合計**: $0/月（無料プラン範囲内）

## 今後の拡張

### Phase 1（現在）

- ✅ Cloudflare Pages/Workers
- ✅ Cloudflare D1 / Workers KV / R2（画像）
- ✅ Sentry

### Phase 2（検討中）

- [ ] CDN最適化
- [ ] Durable Objectsの検討
- [ ] R2 カスタムドメイン / 公開 URL の本設定

### Phase 3（将来）

- [ ] Multi-region対応
- [ ] より高度な可観測性

## 参考資料

- [インフラアーキテクチャ図](../../architecture/infra-architecture.md)（自動生成）
- [APIキー・トークン発行手順](../setup/api-keys.md)
- [Cloudflare Documentation](https://developers.cloudflare.com/)
- [Pulumi Documentation](https://www.pulumi.com/docs/)

## 変更履歴

| 日付 | 変更内容 | 担当 |
| ---- | -------- | ---- |
| 2026-07-23 | Cloudflare 専用化（D1/KV/R2、TiDB/Redis/Grafana/B2 削除） | - |
| 2024-02-19 | 初版作成 | - |
