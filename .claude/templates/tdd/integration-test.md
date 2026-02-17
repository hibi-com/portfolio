# 統合テスト（Medium Test）テンプレート

## IMPORTANT: このテンプレートに従って一貫した形式で統合テストを作成すること

## ファイル配置規則

```text
apps/api/tests/medium/{domain}/{operation}.medium.test.ts
```

## 命名規則

| 要素 | 規則 | 例 |
| ---- | ---- | -- |
| ファイル名 | `{operation}.medium.test.ts` | `create-customer.medium.test.ts` |
| describe | シーケンス図の操作名 | `describe("Create Customer")` |

## シーケンス図との対応

```typescript
/**
 * @sequence docs/sequence/api/{domain}/{operation}.md
 */
```

## テンプレート本体

```typescript
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";
import { setupTestDb, teardownTestDb, cleanupTestData } from "../setup/db.setup";
import { createTestContainer } from "../setup/container.setup";
import type { PrismaClient } from "@prisma/client";

describe("{Domain} {Operation} Integration", () => {
    let prisma: PrismaClient;
    let container: ReturnType<typeof createTestContainer>;

    beforeAll(async () => {
        // テストDB初期化
        prisma = await setupTestDb();
        container = createTestContainer(prisma);
    });

    afterAll(async () => {
        // テストDB終了処理
        await teardownTestDb(prisma);
    });

    afterEach(async () => {
        // 各テスト後のデータクリーンアップ
        await cleanupTestData(prisma);
    });

    describe("シーケンス: Client → API → UseCase → Repository → DB", () => {
        describe("正常系", () => {
            test("{正常系シナリオ1}", async () => {
                // Given: DBにデータが存在する状態
                const seedData = await prisma.{table}.create({
                    data: {
                        // シードデータ
                    },
                });

                // When: UseCaseを実行
                const useCase = container.get{UseCase}();
                const result = await useCase.execute({
                    // 入力パラメータ
                });

                // Then: 期待される結果を検証
                expect(result.isSuccess()).toBe(true);
                expect(result.value).toMatchObject({
                    // 期待される出力
                });

                // Then: DBの状態を検証
                const dbRecord = await prisma.{table}.findUnique({
                    where: { id: result.value.id },
                });
                expect(dbRecord).toMatchObject({
                    // 期待されるDB状態
                });
            });

            test("{正常系シナリオ2: 関連データあり}", async () => {
                // Given: 関連データを含むシードデータ
                const parent = await prisma.{parentTable}.create({
                    data: {
                        // 親データ
                        {children}: {
                            create: [
                                // 子データ
                            ],
                        },
                    },
                    include: {
                        {children}: true,
                    },
                });

                // When
                const useCase = container.get{UseCase}();
                const result = await useCase.execute({
                    parentId: parent.id,
                });

                // Then
                expect(result.isSuccess()).toBe(true);
            });
        });

        describe("異常系", () => {
            test("{存在しないリソースへのアクセス}", async () => {
                // Given: 存在しないID
                const nonExistentId = "non-existent-id";

                // When
                const useCase = container.get{UseCase}();
                const result = await useCase.execute({
                    id: nonExistentId,
                });

                // Then
                expect(result.isFailure()).toBe(true);
                expect(result.error.code).toBe("NOT_FOUND");
            });

            test("{バリデーションエラー}", async () => {
                // Given: 不正な入力
                const invalidInput = {
                    // 不正なデータ
                };

                // When
                const useCase = container.get{UseCase}();
                const result = await useCase.execute(invalidInput);

                // Then
                expect(result.isFailure()).toBe(true);
                expect(result.error.code).toBe("VALIDATION_ERROR");
            });

            test("{ビジネスルール違反}", async () => {
                // Given: ビジネスルールに違反する状態
                await prisma.{table}.create({
                    data: {
                        // 違反状態を作るデータ
                    },
                });

                // When
                const useCase = container.get{UseCase}();
                const result = await useCase.execute({
                    // 違反を引き起こす入力
                });

                // Then
                expect(result.isFailure()).toBe(true);
                expect(result.error.code).toBe("{BUSINESS_RULE_ERROR}");
            });
        });

        describe("トランザクション", () => {
            test("{トランザクションのロールバック}", async () => {
                // Given: エラーを引き起こすモック
                const mockRepository = {
                    save: vi.fn().mockRejectedValue(new Error("DB Error")),
                };

                // When
                const useCase = container.get{UseCase}(mockRepository);

                // Then: トランザクションがロールバックされる
                await expect(useCase.execute({})).rejects.toThrow();

                // DBに変更がないことを確認
                const count = await prisma.{table}.count();
                expect(count).toBe(0);
            });
        });
    });

    describe("API統合テスト", () => {
        test("{HTTPリクエスト経由のテスト}", async () => {
            // Given: シードデータ
            await prisma.{table}.create({
                data: { /* ... */ },
            });

            // When: HTTPリクエスト
            const response = await fetch("http://localhost:{port}/api/{path}", {
                method: "{METHOD}",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    // リクエストボディ
                }),
            });

            // Then: レスポンス検証
            expect(response.status).toBe({expectedStatus});
            const body = await response.json();
            expect(body).toMatchObject({
                // 期待されるレスポンス
            });
        });
    });
});
```

## テストデータ管理

### シードデータヘルパー

```typescript
// tests/medium/setup/seed.ts
export async function seedCustomer(prisma: PrismaClient, overrides = {}) {
    return prisma.customer.create({
        data: {
            name: "Test Customer",
            email: "test@example.com",
            ...overrides,
        },
    });
}

export async function seedCustomerWithDeals(prisma: PrismaClient) {
    return prisma.customer.create({
        data: {
            name: "Test Customer",
            deals: {
                create: [
                    { title: "Deal 1", amount: 1000 },
                    { title: "Deal 2", amount: 2000 },
                ],
            },
        },
        include: {
            deals: true,
        },
    });
}
```

## 実行コマンド

```bash
bun run integration

# 特定ドメイン
bun run integration --filter={domain}
```

## 出力フォーマット（テスト作成後）

```markdown
## 作成した統合テスト

- **ファイル**: {path}
- **対応シーケンス図**: [{name}]({sequence-path})
- **テストケース数**: {count}

### テストケース一覧

| カテゴリ | テスト名 | 検証内容 |
| -------- | -------- | -------- |
| 正常系 | {name} | {内容} |
| 異常系 | {name} | {内容} |
| トランザクション | {name} | {内容} |

### シーケンス図との対応

| シーケンス図のステップ | テストでの検証 |
| ---------------------- | -------------- |
| Client → API | HTTPリクエスト |
| API → UseCase | UseCase実行 |
| UseCase → Repository | DB操作結果 |

### 確認事項

- [ ] シーケンス図の全ステップをカバー
- [ ] 正常系・異常系を網羅
- [ ] DBの状態変更を検証
```
