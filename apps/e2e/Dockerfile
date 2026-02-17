FROM oven/bun:1.1.43 AS builder

ARG REGISTRY_URL

WORKDIR /app

RUN printf '[install.scopes]\n"@portfolio" = "%s"\n' "${REGISTRY_URL}" >> ~/.bunfig.toml

RUN apt-get update && apt-get install -y --no-install-recommends jq=1.6-2.1+deb11u1 && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN jq 'del(.devDependencies) | del(.dependencies["@portfolio/cms"]) | '\
'if .dependencies then .dependencies |= '\
'with_entries(if .value == "workspace:*" then .value = "^1.0.0" else . end) else . end | '\
'if .peerDependencies then .peerDependencies |= '\
'with_entries(if .value == "workspace:*" then .value = "^1.0.0" else . end) else . end' \
  package.json > package.tmp.json \
  && mv package.tmp.json package.json \
  && bun install --ignore-scripts

COPY . .
RUN jq 'del(.devDependencies) | del(.dependencies["@portfolio/cms"]) | '\
'if .dependencies then .dependencies |= '\
'with_entries(if .value == "workspace:*" then .value = "^1.0.0" else . end) else . end | '\
'if .peerDependencies then .peerDependencies |= '\
'with_entries(if .value == "workspace:*" then .value = "^1.0.0" else . end) else . end' \
  package.json > package.tmp.json \
  && mv package.tmp.json package.json \
  && bun install --ignore-scripts \
  && bun run build

FROM nginx:alpine-slim

COPY --from=builder /app/build /usr/share/nginx/html

RUN printf "%s" \
  "server{listen 80;root /usr/share/nginx/html;index index.html;" \
  "location /{try_files \$uri \$uri/ /index.html;}}" \
  > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
