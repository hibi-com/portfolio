FROM oven/bun:1.1.43 AS builder

ARG REGISTRY_URL=http://host.docker.internal:4873

WORKDIR /app

RUN printf '[install.scopes]\n"@portfolio" = "%s"\n' "${REGISTRY_URL}" >> ~/.bunfig.toml

RUN apt-get update && apt-get install -y --no-install-recommends jq=1.6-2.1+deb11u1 && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN jq 'del(.devDependencies) | '\
'if .dependencies then .dependencies |= '\
'with_entries(if .value == "workspace:*" then .value = "^1.0.0" else . end) else . end | '\
'if .peerDependencies then .peerDependencies |= '\
'with_entries(if .value == "workspace:*" then .value = "^1.0.0" else . end) else . end' \
  package.json > package.tmp.json \
  && mv package.tmp.json package.json \
  && bun install --ignore-scripts

COPY . .
RUN jq 'del(.devDependencies) | '\
'if .dependencies then .dependencies |= '\
'with_entries(if .value == "workspace:*" then .value = "^1.0.0" else . end) else . end | '\
'if .peerDependencies then .peerDependencies |= '\
'with_entries(if .value == "workspace:*" then .value = "^1.0.0" else . end) else . end' \
  package.json > package.tmp.json \
  && mv package.tmp.json package.json \
  && bun install --ignore-scripts \
  && bunx prisma@5.22.0 generate --schema=node_modules/@portfolio/db/prisma/schema --generator=client \
  && bun build --compile --minify --sourcemap ./src/index.ts --outfile server

FROM gcr.io/distroless/base-nossl-debian12@sha256:c0d97a3f0d6ad7d75c6494e3d6da54f09a961b80d755f0a09c7328f5a8edee5e

WORKDIR /app

COPY --from=builder /app/server .

ENV PORT=3000
EXPOSE 3000

CMD ["./server"]
