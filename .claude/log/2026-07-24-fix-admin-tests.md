# Fix @portfolio/admin tests

## 結果

`bun run --filter=@portfolio/admin test` → **210 passed**

## 原因と対応

1. **InquiriesList** — `inquiry.type.replace` がクラッシュ（API の `Inquiry` は `category`）。`category?.replace("_", " ") ?? "-"` に修正。
2. **DealsKanban テスト** — 金額 `10,000` が Total とカードで重複し `getByText` が失敗。`getAllByText` に変更。
3. （先行）mutation hook テストの `act`/`waitFor`、MSW `dist` flatten などは会話前半で対応済み。
