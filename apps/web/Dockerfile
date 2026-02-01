# Web: イメージ内でビルドしない・turbo は使わない。
#
# 開発（compose）: ビルドコンテキスト = リポジトリルート。compose で volume マウント (.:/app) し、
#                 ホストで bun install / パッケージビルド済みのソースで remix vite:dev を実行する。
# 本番（K8s）:    CI がビルドした静的成果物（build/ の中身）をコンテキストに渡し、
#                 docker build -f apps/web/Dockerfile -t web ./out/web のようにビルドする。
#                 Dockerfile が COPY . で nginx に配信する想定のときは、コンテキスト = build/ の中身。

FROM oven/bun:1.1.43-alpine

WORKDIR /app

COPY apps/web/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 開発時は compose の volume で . が /app にマウントされ、ホストのソースで動く
WORKDIR /app/apps/web

EXPOSE 5173

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["bunx", "remix", "vite:dev"]
