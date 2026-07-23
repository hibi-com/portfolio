FROM oven/bun:1.1.43@sha256:10cda3ac52b7ddfb3dda2fd1f0ed2147dcb8d5b7ed7baeffbfcaf6e15c1c00df AS builder

ARG REGISTRY_URL

WORKDIR /app

RUN printf '[install.scopes]\n"@portfolio" = "%s"\n' "${REGISTRY_URL}" >> ~/.bunfig.toml

RUN apt-get update && apt-get install -y --no-install-recommends jq=1.6-2.1+deb11u1 && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN jq 'del(.dependencies["@portfolio/cms"]) | '\
'if .dependencies then .dependencies |= '\
'with_entries(if .value == "workspace:*" then .value = "^1.0.0" else . end) else . end | '\
'if .devDependencies then .devDependencies |= '\
'with_entries(if .value == "workspace:*" then .value = "^1.0.0" else . end) else . end | '\
'if .peerDependencies then .peerDependencies |= '\
'with_entries(if .value == "workspace:*" then .value = "^1.0.0" else . end) else . end' \
  package.json > package.tmp.json \
  && mv package.tmp.json package.json \
  && bun install --ignore-scripts

COPY . .
RUN jq 'del(.dependencies["@portfolio/cms"]) | '\
'if .dependencies then .dependencies |= '\
'with_entries(if .value == "workspace:*" then .value = "^1.0.0" else . end) else . end | '\
'if .devDependencies then .devDependencies |= '\
'with_entries(if .value == "workspace:*" then .value = "^1.0.0" else . end) else . end | '\
'if .peerDependencies then .peerDependencies |= '\
'with_entries(if .value == "workspace:*" then .value = "^1.0.0" else . end) else . end' \
  package.json > package.tmp.json \
  && mv package.tmp.json package.json \
  && bun install --ignore-scripts \
  && bun x remix vite:build

FROM nginx:1.27.4-alpine-slim@sha256:b05aceb5ec1844435cae920267ff9949887df5b88f70e11d8b2871651a596612

COPY --from=builder /app/build /usr/share/nginx/html

RUN printf "%s" \
  "server{listen 80;root /usr/share/nginx/html;index index.html;" \
  "location /{try_files \$uri \$uri/ /index.html;}}" \
  > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
