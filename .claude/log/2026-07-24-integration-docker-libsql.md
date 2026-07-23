# 統合テスト修正（Docker libSQL + シーケンス準拠）

## 原因

- `setupTestDb` が `file::memory` を使い、マイグレーション未適用で `no such table` になっていた
- CRM の異常系（変換済みリード / クローズ済み商談 / 顧客更新）がシーケンス図どおり実装されていなかった

## 対応

- デフォルト DB を Docker libSQL `http://127.0.0.1:8081` に変更
- スキーマ未作成時は `20260723000000_init_sqlite` を適用
- CircleCI `integration` ジョブに libSQL サイドカー追加
- lead / deal / customer リポジトリをシーケンス図の異常系に合わせて修正
- chat / post のアサーションを現行ドメイン型に合わせて修正

## 結果

`bun run integration`（@portfolio/cms）: 55/55 成功
