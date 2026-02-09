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

RUN bun add @portfolio/api @portfolio/auth @portfolio/cache @portfolio/db @portfolio/log --registry "${REGISTRY_URL}"

COPY . .
RUN bun build --compile --minify --sourcemap ./src/index.ts --outfile server

FROM gcr.io/distroless/base-nossl-debian12@sha256:c0d97a3f0d6ad7d75c6494e3d6da54f09a961b80d755f0a09c7328f5a8edee5e

WORKDIR /app

COPY --from=builder /app/server .

ENV PORT=3000
EXPOSE 3000

CMD ["./server"]
