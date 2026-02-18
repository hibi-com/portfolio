---
title: "Architecture Overview"
---

このプロジェクトは、**Turborepo + Bun Workspaces** を採用したMonorepo構造のポートフォリオプロジェクトです。

## Monorepo

複数のアプリケーションとパッケージを単一のリポジトリで管理しています。  
ディレクトリ構成は変更されやすいため、詳細はリポジトリの `apps/`・`packages/`・`tooling/` を直接参照してください。

- **技術スタック**: [技術スタック](../development/tech-stack.md) を参照（単一ファイルで管理）。
- **命名ルール**: `utils` というディレクトリ名は**厳格に禁止**。代わりに `lib`、`shared`、`infra` または具体的な名前を使用する。

## Feature-Sliced Design (FSD)

フロントエンドで Feature-Sliced Design を採用しています。  
詳細は [`feature-sliced.md`](./feature-sliced.md) を参照してください。

## Domain-Driven Design (DDD)

バックエンド API で Domain-Driven Design を採用しています。  
詳細は [`domain-driven.md`](./domain-driven.md) を参照してください。

## インフラストラクチャ

Pulumi で管理する構成と関係は [`infra-architecture.md`](./infra-architecture.md) を参照してください。
