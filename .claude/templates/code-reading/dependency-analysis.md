# 依存関係分析テンプレート

## IMPORTANT: このテンプレートに従って一貫した形式で依存関係分析を行うこと

## 分析手順

### Step 1: 対象ファイルの特定

```bash
# 分析対象ファイルを確認
ls -la {target-path}
cat {target-file}
```

#### 基本情報

| 項目 | 値 |
| ---- | -- |
| ファイルパス | {path} |
| ファイル種類 | {type: component/module/class/function} |
| 行数 | {lines} |
| エクスポート | {exports} |

### Step 2: インポート分析

```bash
# インポート文を抽出
grep -n "^import" {target-file}
grep -n "require(" {target-file}
```

#### インポート一覧

| 種類 | モジュール | インポート対象 | 用途 |
| ---- | ---------- | -------------- | ---- |
| External | {package} | {imports} | {用途} |
| Internal | {path} | {imports} | {用途} |
| Type-only | {path} | {types} | {用途} |

#### 依存の分類

| 分類 | パッケージ/パス | 影響度 |
| ---- | --------------- | ------ |
| 必須依存 | {name} | 高 |
| オプション依存 | {name} | 低 |
| 開発依存 | {name} | - |

### Step 3: エクスポート分析

```bash
# エクスポートを抽出
grep -n "^export" {target-file}
```

#### エクスポート一覧

| 種類 | 名前 | 型 | 説明 |
| ---- | ---- | -- | ---- |
| default | {name} | {type} | {説明} |
| named | {name} | {type} | {説明} |
| type | {name} | {type} | {説明} |

### Step 4: 被依存分析（このファイルを使用しているファイル）

```bash
# このファイルをインポートしているファイルを検索
grep -r "from ['\"].*{filename}" --include="*.ts" --include="*.tsx"
```

#### 被依存一覧

| ファイル | インポート対象 | 用途 |
| -------- | -------------- | ---- |
| {path} | {imports} | {用途} |

### Step 5: 依存グラフの作成

```mermaid
graph LR
    subgraph "External Dependencies"
        E1[{package1}]
        E2[{package2}]
    end

    subgraph "Internal Dependencies"
        I1[{internal1}]
        I2[{internal2}]
    end

    T[{target-file}] --> E1
    T --> E2
    T --> I1
    T --> I2

    subgraph "Dependents"
        D1[{dependent1}]
        D2[{dependent2}]
    end

    D1 --> T
    D2 --> T
```

### Step 6: 循環依存チェック

```bash
# 循環依存の確認
# A -> B -> C -> A のようなパターンを探す
```

#### 循環依存

| パス | 危険度 | 対処 |
| ---- | ------ | ---- |
| {A -> B -> A} | {高/中/低} | {対処方法} |

### Step 7: 依存の健全性評価

| チェック項目 | 結果 | 備考 |
| ------------ | ---- | ---- |
| 循環依存なし | {Yes/No} | {備考} |
| レイヤー違反なし | {Yes/No} | {備考} |
| 未使用インポートなし | {Yes/No} | {備考} |
| 型のみインポート分離 | {Yes/No} | {備考} |

## 出力フォーマット

```markdown
## 依存関係分析結果

### 対象

- **ファイル**: {path}
- **種類**: {type}

### 依存サマリー

| 種類 | 数 |
| ---- | -- |
| 外部パッケージ | {count} |
| 内部モジュール | {count} |
| 型インポート | {count} |
| 被依存ファイル | {count} |

### 依存グラフ

{mermaid図}

### 問題点

- {問題1}
- {問題2}

### 改善提案

- {提案1}
- {提案2}
```
