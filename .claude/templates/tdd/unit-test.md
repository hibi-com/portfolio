# ユニットテスト（Small Test）テンプレート

## IMPORTANT: このテンプレートに従って一貫した形式でユニットテストを作成すること

## ファイル配置規則

```text
# テスト対象ファイルと同じディレクトリに配置
src/domain/entities/user.ts
src/domain/entities/user.test.ts  # ← テストファイル
```

## 命名規則

| 要素 | 規則 | 例 |
| ---- | ---- | -- |
| ファイル名 | `{対象}.test.ts` | `user.test.ts`, `formatDate.test.ts` |
| describe | 機能名/クラス名 | `describe("User")` |
| test | 日本語で振る舞いを記述 | `test("有効なメールアドレスを受け入れる")` |

## TDDサイクル

```text
┌─────────┐     ┌─────────┐     ┌───────────┐
│   Red   │ ──▶ │  Green  │ ──▶ │ Refactor  │
│ テスト作成│     │最小限実装│     │ 品質改善  │
└─────────┘     └─────────┘     └───────────┘
     ▲                               │
     └───────────────────────────────┘
```

## テンプレート本体

```typescript
import { describe, expect, test, beforeEach, vi } from "vitest";

// テスト対象のインポート
import { TargetClass } from "./target";
import type { Dependency } from "./dependency";

describe("{TargetClass/Function}", () => {
    // テスト対象のインスタンス
    let target: TargetClass;

    // モック
    const mockDependency: Dependency = {
        method: vi.fn(),
    };

    beforeEach(() => {
        // 各テスト前の初期化
        vi.clearAllMocks();
        target = new TargetClass(mockDependency);
    });

    describe("{メソッド名/機能名}", () => {
        describe("正常系", () => {
            test("{期待される動作を日本語で記述}", () => {
                // Given: 前提条件
                const input = {
                    // テストデータ
                };

                // When: 操作
                const result = target.method(input);

                // Then: 検証
                expect(result).toEqual({
                    // 期待値
                });
            });

            test("{別の正常系ケース}", () => {
                // Given
                // When
                // Then
            });
        });

        describe("境界値", () => {
            test("{境界値の下限}", () => {
                // Given
                const input = { value: 0 }; // 最小値

                // When
                const result = target.method(input);

                // Then
                expect(result).toBeDefined();
            });

            test("{境界値の上限}", () => {
                // Given
                const input = { value: 100 }; // 最大値

                // When
                const result = target.method(input);

                // Then
                expect(result).toBeDefined();
            });
        });

        describe("異常系", () => {
            test("{エラーケース: null入力}", () => {
                // Given
                const input = null;

                // When & Then
                expect(() => target.method(input)).toThrow("{ExpectedError}");
            });

            test("{エラーケース: 不正な値}", () => {
                // Given
                const input = { value: -1 }; // 不正な値

                // When & Then
                expect(() => target.method(input)).toThrow("{ExpectedError}");
            });
        });

        describe("エッジケース", () => {
            test("{空配列の場合}", () => {
                // Given
                const input = { items: [] };

                // When
                const result = target.method(input);

                // Then
                expect(result).toEqual({ items: [] });
            });

            test("{空文字の場合}", () => {
                // Given
                const input = { name: "" };

                // When
                const result = target.method(input);

                // Then
                expect(result.name).toBe("");
            });
        });
    });

    describe("依存関係のモック", () => {
        test("{モックが正しく呼び出される}", () => {
            // Given
            mockDependency.method.mockReturnValue("mocked");

            // When
            target.methodUsingDependency();

            // Then
            expect(mockDependency.method).toHaveBeenCalledWith(
                expect.objectContaining({
                    // 期待される引数
                })
            );
            expect(mockDependency.method).toHaveBeenCalledTimes(1);
        });
    });
});
```

## テストケース設計チェックリスト

### 正常系

- [ ] 基本的な正常動作
- [ ] 複数パターンの正常入力
- [ ] オプショナルパラメータあり/なし

### 境界値

- [ ] 最小値
- [ ] 最大値
- [ ] 境界値 ± 1

### 異常系

- [ ] null/undefined入力
- [ ] 型エラー
- [ ] バリデーションエラー
- [ ] ビジネスルール違反

### エッジケース

- [ ] 空配列/空オブジェクト
- [ ] 空文字
- [ ] 特殊文字
- [ ] 大量データ

## 実行コマンド

```bash
# 単一ファイル実行（ルートの script、ファイルは -- で渡す）
bun run test -- {path/to/file.test.ts}

# ウォッチモード（-- の後にオプション・ファイルを渡す）
bun run test -- --watch {path/to/file.test.ts}

# カバレッジ付き
bun run coverage -- {path/to/file.test.ts}
```

## カバレッジ基準

| メトリクス | 閾値 |
| ---------- | ---- |
| Lines | 90% |
| Functions | 90% |
| Branches | **100%** |
| Statements | 90% |

## 出力フォーマット（テスト作成後）

```markdown
## 作成したテスト

- **ファイル**: {path}
- **テスト対象**: {target}
- **テストケース数**: {count}

### テストケース一覧

| カテゴリ | テスト名 | 検証内容 |
| -------- | -------- | -------- |
| 正常系 | {name} | {内容} |
| 境界値 | {name} | {内容} |
| 異常系 | {name} | {内容} |

### カバレッジ

| メトリクス | 値 |
| ---------- | -- |
| Lines | {%} |
| Branches | {%} |

### 確認事項

- [ ] テストが失敗することを確認（Red）
- [ ] 実装後にテストが通過（Green）
```
