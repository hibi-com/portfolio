FROM oven/bun:1.1.43 AS builder

WORKDIR /app

COPY package.json ./
RUN bun install --frozen-lockfile --ignore-scripts

COPY . .
RUN bun run build

FROM nginx:alpine-slim

COPY --from=builder /app/build /usr/share/nginx/html

RUN printf "%s" \
  "server{listen 80;root /usr/share/nginx/html;index index.html;" \
  "location /{try_files \$uri \$uri/ /index.html;}}" \
  > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
