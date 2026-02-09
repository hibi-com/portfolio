FROM oven/bun:1.1.43 AS builder

ARG REGISTRY_URL=http://verdaccio:4873

WORKDIR /app

COPY package.json ./

RUN apt-get update && apt-get install -y --no-install-recommends jq=1.6-2.1 && \
    jq 'del(.devDependencies) | .dependencies = (.dependencies | to_entries | \
    map(select(.value | test("^workspace:") | not) | {(.key): .value}) | add // {})' \
    package.json > package.tmp.json && \
    mv package.tmp.json package.json && \
    echo "registry=${REGISTRY_URL}" > ~/.npmrc && \
    bun install --ignore-scripts

RUN bun add @portfolio/api @portfolio/cms @portfolio/log @portfolio/ui --registry "${REGISTRY_URL}"

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
