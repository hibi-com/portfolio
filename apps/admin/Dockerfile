# Admin: 本番(K8s)用。イメージ内でビルドしない・turbo は使わない。
# ビルドは CI で行い、このイメージには成果物（静的 dist）のみを載せる。
#
# ビルドコンテキスト: CI が出力した admin の dist の中身（index.html, assets/ 等）
# 例: turbo run build --filter=@portfolio/admin のあと、
#     cp -r apps/admin/dist out/admin && docker build -f apps/admin/Dockerfile -t admin out/admin

FROM nginx:alpine

COPY . /usr/share/nginx/html/
RUN echo 'server { root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
