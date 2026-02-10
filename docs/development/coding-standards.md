---
title: "コーディング規約"
---

## フォーマット

### Biome設定

- **インデント**: スペース4つ
- **行幅**: 120文字
- **セミコロン**: 必須
- **クォート**: ダブルクォート（JSX含む）
- **末尾カンマ**: あり（JavaScript/TypeScript）
- **アロー関数の括弧**: 常に使用

### コードスタイル

```typescript
// ✅ Good: セミコロンあり、末尾カンマあり
const items = [
    "item1",
    "item2",
];

// ✅ Good: アロー関数に括弧を使用
const handleClick = () => {
    // ...
};

// ✅ Good: ダブルクォートを使用
const message = "Hello, world!";
```

## 命名規則

### コンポーネント

- **PascalCase**を使用

- ファイル名はコンポーネント名と一致させる

```typescript
// ✅ Good
export const BlogPreview = () => {
    // ...
};

// ファイル名: BlogPreview.tsx
```

### 変数・関数

- **camelCase**を使用

- 関数は動詞で始める（`handle`, `get`, `set` / `is`, `has` など）

```typescript
// ✅ Good
const userName = "John";
const handleSubmit = () => {};
const getUserData = () => {};
const isVisible = true;
const hasPermission = false;
```

### 定数

- **UPPER\_SNAKE\_CASE**を使用

- `shared/config/constants.ts`に集約

```typescript
// ✅ Good
export const SITE_TITLE = "Portfolio";
export const SOCIAL_GITHUB = "https://github.com/...";
```

### 型・インターフェース

- **PascalCase**を使用

- インターフェースは`Props`サフィックスを付ける

```typescript
// ✅ Good
export interface BlogPreviewProps {
    title: string;
    date: string;
}

export type UserRole = "admin" | "user";
```

## インポート順序

1. 外部ライブラリ（React、Remixなど）
2. 内部モジュール（`~/shared`, `~/features`など）
3. 相対インポート
4. 型インポート（`type`キーワードを使用）

```typescript
// ✅ Good
import { Link } from "@remix-run/react";
import classnames from "classnames";

import { BlogPreview } from "~/features/blog-preview";
import { Button } from "@portfolio/ui";

import type { BlogPreviewProps } from "~/features/blog-preview";
```

## TypeScript

### 型定義

- 厳格モードを有効化
- `any`の使用を避ける
- 型推論を活用するが、明示的な型も適切に使用

```typescript
// ✅ Good: 型推論を活用
const count = 0; // number

// ✅ Good: 明示的な型が必要な場合
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // ...
};

// ❌ Bad: anyの使用
const data: any = fetchData();
```

### Props型定義

- コンポーネントファイル内で定義
- `export`して再利用可能にする

```typescript
// ✅ Good
export interface BlogPreviewProps {
    title: string;
    date: string;
    className?: string;
}

export const BlogPreview = (props: BlogPreviewProps) => {
    // ...
};
```

## コメント

- 複雑なロジックには説明コメントを追加
- JSDocコメントは公開APIに使用

```typescript
// ✅ Good: 複雑なロジックの説明
// 日付をUTCタイムゾーンでフォーマットし、ローカルタイムゾーンに変換
const dateString = created.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
    year: "numeric",
});

export const BlogPreview = (props: BlogPreviewProps) => {
    // ...
};
```

## ファイル構造

### コンポーネントファイル

```typescript
// 1. インポート
import { Link } from "@remix-run/react";

// 2. 型定義
export interface ComponentProps {
    // ...
}

// 3. コンポーネント実装
export const Component = (props: ComponentProps) => {
    // ...
};

// 4. デフォルトエクスポート（必要な場合のみ）
export default Component;
```
