FROM oven/bun:1.1.43-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN bun install --frozen-lockfile --ignore-scripts

COPY . .
RUN bun build --compile --minify --sourcemap ./src/index.ts --outfile server

FROM gcr.io/distroless/base-nossl-debian12@sha256:c0d97a3f0d6ad7d75c6494e3d6da54f09a961b80d755f0a09c7328f5a8edee5e

WORKDIR /app

COPY --from=builder /app/server .

ENV PORT=3000
EXPOSE 3000

CMD ["./server"]
