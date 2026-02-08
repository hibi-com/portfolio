# リファクタリングテンプレート

## IMPORTANT: このテンプレートに従って一貫した形式でリファクタリングを行うこと

## リファクタリング原則

1. **テストが先**: リファクタリング前に既存テストが通過することを確認
2. **小さく頻繁に**: 大きな変更を避け、小さなステップで進める
3. **動作を変えない**: 外部から見た振る舞いを維持
4. **コミットを細かく**: 各ステップでコミット

## リファクタリング手順

### Step 1: 現状分析

```bash
# 対象ファイルの確認
cat {target-file}

# 依存関係の確認
grep -r "import.*{target}" --include="*.ts"

# テストの確認
ls -la {target-dir}/*.test.ts
```

#### 現状

| 項目 | 値 |
| ---- | -- |
| ファイルパス | {path} |
| 行数 | {lines} |
| 関数/クラス数 | {count} |
| 依存されているファイル数 | {count} |
| テストカバレッジ | {%} |

#### コードスメル

| スメル | 該当箇所 | 深刻度 |
| ------ | -------- | ------ |
| {smell} | {location} | {高/中/低} |

### Step 2: 既存テストの実行

```bash
# 関連テストを実行
bun vitest run {target-file}

# カバレッジ確認
bun vitest run --coverage {target-file}
```

#### テスト結果

| 項目 | 値 |
| ---- | -- |
| テスト数 | {count} |
| 成功 | {pass} |
| 失敗 | {fail} |
| カバレッジ | {%} |

**IMPORTANT**: テストが全て通過していない場合、リファクタリングを開始しないこと

### Step 3: リファクタリング計画

#### 適用するリファクタリングパターン

| パターン | 適用箇所 | 期待効果 |
| -------- | -------- | -------- |
| Extract Method | {location} | 可読性向上 |
| Extract Class | {location} | 責務分離 |
| Rename | {location} | 明確な命名 |
| Move Method | {location} | 適切な配置 |
| Replace Conditional with Polymorphism | {location} | 拡張性向上 |

#### 作業順序

1. [ ] {ステップ1}
2. [ ] {ステップ2}
3. [ ] {ステップ3}

### Step 4: リファクタリング実行

#### パターン別実行手順

##### Extract Method（メソッド抽出）

```typescript
// Before
function processOrder(order: Order) {
    // 検証ロジック（ここを抽出）
    if (!order.items.length) throw new Error("No items");
    if (order.total < 0) throw new Error("Invalid total");

    // 処理ロジック
    // ...
}

// After
function validateOrder(order: Order): void {
    if (!order.items.length) throw new Error("No items");
    if (order.total < 0) throw new Error("Invalid total");
}

function processOrder(order: Order) {
    validateOrder(order);
    // 処理ロジック
    // ...
}
```

##### Extract Class（クラス抽出）

```typescript
// Before: 責務が多すぎるクラス
class OrderService {
    validate() { /* ... */ }
    calculateTotal() { /* ... */ }
    sendEmail() { /* ... */ }
    generateInvoice() { /* ... */ }
}

// After: 責務を分離
class OrderValidator {
    validate(order: Order): ValidationResult { /* ... */ }
}

class OrderCalculator {
    calculateTotal(order: Order): number { /* ... */ }
}

class OrderService {
    constructor(
        private validator: OrderValidator,
        private calculator: OrderCalculator,
    ) {}
}
```

##### Replace Conditional with Strategy

```typescript
// Before
function calculateDiscount(type: string, amount: number): number {
    if (type === "premium") return amount * 0.2;
    if (type === "gold") return amount * 0.15;
    if (type === "silver") return amount * 0.1;
    return 0;
}

// After
interface DiscountStrategy {
    calculate(amount: number): number;
}

class PremiumDiscount implements DiscountStrategy {
    calculate(amount: number): number { return amount * 0.2; }
}

class DiscountCalculator {
    constructor(private strategy: DiscountStrategy) {}
    calculate(amount: number): number {
        return this.strategy.calculate(amount);
    }
}
```

### Step 5: テストの再実行

```bash
# 各ステップ後にテスト実行
bun vitest run {target-file}

# 全テスト実行
bun run test
```

#### 確認事項

- [ ] 全テストが通過
- [ ] カバレッジが維持または向上
- [ ] 型エラーがない

### Step 6: コミット

```bash
# 小さなステップでコミット
git add {changed-files}
git commit -m "refactor: {変更内容}"
```

## 出力フォーマット

```markdown
## リファクタリング結果

### 概要

- **対象**: {path}
- **適用パターン**: {patterns}

### Before/After比較

| メトリクス | Before | After | 変化 |
| ---------- | ------ | ----- | ---- |
| 行数 | {lines} | {lines} | {diff} |
| 関数数 | {count} | {count} | {diff} |
| 循環的複雑度 | {value} | {value} | {diff} |
| テストカバレッジ | {%} | {%} | {diff} |

### 変更内容

1. {変更1}
2. {変更2}

### テスト結果

- 実行テスト数: {count}
- 成功: {pass}
- 失敗: {fail}

### 確認事項

- [ ] 全テスト通過
- [ ] 型チェック通過
- [ ] リント通過
- [ ] 動作確認完了
```
