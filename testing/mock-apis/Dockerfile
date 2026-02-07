FROM oven/bun:1-alpine

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

WORKDIR /app/testing/mock-apis

ENV PORT=3920

EXPOSE 3920

CMD ["bun", "run", "dev"]
