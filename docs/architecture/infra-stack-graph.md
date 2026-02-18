---
title: "インフラスタックグラフ（自動生成）"
---

この図は Pulumi のデフォルトコマンド `pulumi stack graph` により、自動生成されています。

## リソース依存グラフ

![Pulumi stack graph](infra-stack-graph.svg)

## 再生成方法

`infra` ディレクトリで以下を実行してください。

```bash
cd infra
bun run generate
```

- **前提**: スタックが選択済み（`pulumi stack select <stack>`）かつ、少なくとも 1 回デプロイ済みであること。
- **Graphviz**: SVG を生成するには [Graphviz](https://graphviz.org/) の `dot` コマンドが必要です（例: `brew install graphviz`）。
- DOT ファイルは `infra/graph.dot` に出力され、`dot -Tsvg graph.dot -o docs/architecture/infra-stack-graph.svg` で SVG に変換されます。
