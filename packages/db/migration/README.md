# SQLite / Cloudflare D1 migrations

The previous MySQL/TiDB migration was removed as part of the D1 migration.

## Generate / verify the initial SQLite migration

An initial SQLite migration is provided at `20260723000000_init_sqlite/`.
Prefer regenerating from the schema to keep Prisma's checksum in sync:

```bash
# Start local libSQL first: docker compose up setup-db sqlite
cd packages/db
bun install
bun run generate
DATABASE_URL="http://127.0.0.1:8081" bunx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel ./prisma/schema \
  --script
```

Or create and apply interactively (requires sqld on localhost:8081):

```bash
DATABASE_URL="http://127.0.0.1:8081" bunx prisma migrate dev --name init
```

For Cloudflare D1, apply with Wrangler after generating SQL:

```bash
bunx wrangler d1 migrations apply <DATABASE_NAME>
```
