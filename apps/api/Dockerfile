# API (cms): イメージ内でビルドしない・turbo は使わない。
#
# 開発（compose）: ビルドコンテキスト = リポジトリルート。compose で volume マウント (.:/app) し、
#                 ホストで bun install / パッケージビルド済みのソースで wrangler dev を実行する。
# 本番（K8s）:    CI がビルドした成果物ディレクトリをコンテキストに渡し、
#                 docker build -f apps/api/Dockerfile -t api ./out/api のようにビルドする。

FROM oven/bun:1.1.43-alpine

WORKDIR /app

COPY apps/api/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 開発時は compose の volume で . が /app にマウントされ、ホストのソースで動く
WORKDIR /app/apps/api

EXPOSE 8787

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["bunx", "wrangler", "dev"]
