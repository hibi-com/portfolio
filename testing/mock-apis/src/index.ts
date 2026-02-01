/**
 * 開発・E2E 用の擬似外部 API サーバー。
 * freee 会計 API 等を同一オリジンで再現し、docker compose から利用する。
 */

import { Hono } from "hono";
import { getAuthorize, getCompanies, getPartnerById, getPartners, postPartner, postToken, putPartner } from "./freee";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok", service: "mock-apis" }));

// freee 認証（accounts.secure.freee.co.jp 相当）
app.get("/public_api/authorize", getAuthorize);
app.post("/public_api/token", postToken);

// freee API（api.freee.co.jp 相当）
app.get("/api/1/companies", getCompanies);
app.get("/api/1/partners", getPartners);
app.get("/api/1/partners/:id", getPartnerById);
app.post("/api/1/partners", postPartner);
app.put("/api/1/partners/:id", putPartner);

const port = Number(process.env.PORT) || 3920;

Bun.serve({
    port,
    hostname: "0.0.0.0",
    fetch: app.fetch,
});

console.log(`[mock-apis] listening on http://0.0.0.0:${port}`);
