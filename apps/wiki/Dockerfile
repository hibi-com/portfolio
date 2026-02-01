# Wiki: 本番(K8s)用。イメージ内でビルドしない・turbo は使わない。
# ビルドは CI で行い、このイメージには成果物（静的 dist）のみを載せる。
#
# ビルドコンテキスト: CI が出力した wiki の dist の中身
# 例: turbo run build --filter=@portfolio/wiki のあと、
#     cp -r apps/wiki/dist out/wiki && docker build -f apps/wiki/Dockerfile -t wiki out/wiki

FROM nginx:alpine

COPY . /usr/share/nginx/html/
RUN echo 'server { root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
