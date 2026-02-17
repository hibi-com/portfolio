FROM oven/bun:1.1.43 AS builder

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends jq=1.6-2.1+deb11u1 \
  && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN jq 'del(.devDependencies)' package.json > package.tmp.json \
  && mv package.tmp.json package.json \
  && bun install --ignore-scripts

COPY . .
RUN bun build --compile --minify --sourcemap ./src/index.ts --outfile server

FROM gcr.io/distroless/base-nossl-debian12@sha256:c0d97a3f0d6ad7d75c6494e3d6da54f09a961b80d755f0a09c7328f5a8edee5e

WORKDIR /app

COPY --from=builder /app/server .

ENV PORT=3920
EXPOSE 3920

CMD ["./server"]
