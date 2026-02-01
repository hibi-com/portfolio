/**
 * freee API の擬似実装（開発・E2E用）。
 * freee 会計 API 仕様に沿った必要最小限のエンドポイントを再現する。
 * @see https://developer.freee.co.jp/reference
 */

import type { Context } from "hono";

const MOCK_ACCESS_TOKEN = "mock_access_token";
const MOCK_REFRESH_TOKEN = "mock_refresh_token";
const MOCK_COMPANY_ID = 1;
const MOCK_COMPANY_NAME = "モック株式会社";

/** メモリ上でパートナーを保持（開発用） */
const partnersStore = new Map<number, FreeePartnerRecord>();
let nextPartnerId = 1000;

interface FreeePartnerRecord {
    id: number;
    company_id: number;
    name: string;
    code?: string;
    shortcut1?: string;
    shortcut2?: string;
    address_attributes?: {
        prefecture_code?: number;
        street_name1?: string;
        street_name2?: string;
        zipcode?: string;
    };
    contact_name?: string;
    email?: string;
    phone?: string;
}

function parseBearerToken(c: Context): string | null {
    const auth = c.req.header("Authorization");
    if (!auth?.startsWith("Bearer ")) return null;
    return auth.slice(7);
}

/** GET /public_api/authorize - OAuth 認可画面の代わりに redirect_uri へリダイレクト */
export function getAuthorize(c: Context) {
    const redirectUri = c.req.query("redirect_uri");
    const state = c.req.query("state");
    if (!redirectUri) {
        return c.json({ error: "redirect_uri required" }, 400);
    }
    const url = new URL(redirectUri);
    url.searchParams.set("code", "mock_auth_code");
    if (state) url.searchParams.set("state", state);
    return c.redirect(url.toString(), 302);
}

/** POST /public_api/token - 認可コードまたは refresh_token でトークン発行 */
export async function postToken(c: Context) {
    const body = await c.req.parseBody();
    const grantType = body.grant_type as string;

    if (grantType === "authorization_code") {
        return c.json({
            access_token: MOCK_ACCESS_TOKEN,
            refresh_token: MOCK_REFRESH_TOKEN,
            expires_in: 7200,
            token_type: "bearer",
            scope: "companies",
            created_at: Math.floor(Date.now() / 1000),
        });
    }

    if (grantType === "refresh_token") {
        return c.json({
            access_token: MOCK_ACCESS_TOKEN,
            refresh_token: MOCK_REFRESH_TOKEN,
            expires_in: 7200,
            token_type: "bearer",
            scope: "companies",
            created_at: Math.floor(Date.now() / 1000),
        });
    }

    return c.json({ error: "unsupported_grant_type" }, 400);
}

/** GET /api/1/companies - アクセストークンに紐づく事業所一覧 */
export function getCompanies(c: Context) {
    if (!parseBearerToken(c)) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    return c.json({
        companies: [
            {
                id: MOCK_COMPANY_ID,
                display_name: MOCK_COMPANY_NAME,
                role: "admin",
            },
        ],
    });
}

/** GET /api/1/partners - 取引先一覧 */
export function getPartners(c: Context) {
    const token = parseBearerToken(c);
    if (!token) return c.json({ error: "Unauthorized" }, 401);

    const companyId = c.req.query("company_id");
    const limit = Number(c.req.query("limit")) || 100;
    const companyIdNum = companyId ? Number(companyId) : MOCK_COMPANY_ID;

    const list = Array.from(partnersStore.values()).filter((p) => p.company_id === companyIdNum);
    const partners = list.slice(0, limit).map(toPartnerResponse);
    return c.json({ partners });
}

/** GET /api/1/partners/:id - 取引先1件 */
export function getPartnerById(c: Context) {
    const token = parseBearerToken(c);
    if (!token) return c.json({ error: "Unauthorized" }, 401);

    const id = Number(c.req.param("id"));
    const partner = partnersStore.get(id);
    if (!partner) return c.json({ error: "Not found" }, 404);
    return c.json({ partner: toPartnerResponse(partner) });
}

/** POST /api/1/partners - 取引先作成 */
export async function postPartner(c: Context) {
    const token = parseBearerToken(c);
    if (!token) return c.json({ error: "Unauthorized" }, 401);

    const body = (await c.req.json()) as {
        company_id: number;
        name: string;
        code?: string;
        email?: string;
        phone?: string;
    };

    const id = nextPartnerId++;
    const record: FreeePartnerRecord = {
        id,
        company_id: body.company_id ?? MOCK_COMPANY_ID,
        name: body.name ?? "",
        code: body.code,
        email: body.email,
        phone: body.phone,
    };
    partnersStore.set(id, record);
    return c.json({ partner: toPartnerResponse(record) }, 201);
}

/** PUT /api/1/partners/:id - 取引先更新 */
export async function putPartner(c: Context) {
    const token = parseBearerToken(c);
    if (!token) return c.json({ error: "Unauthorized" }, 401);

    const id = Number(c.req.param("id"));
    const existing = partnersStore.get(id);
    if (!existing) return c.json({ error: "Not found" }, 404);

    const body = (await c.req.json()) as {
        company_id?: number;
        name?: string;
        code?: string;
        email?: string;
        phone?: string;
    };

    const updated: FreeePartnerRecord = {
        ...existing,
        name: body.name ?? existing.name,
        code: body.code ?? existing.code,
        email: body.email ?? existing.email,
        phone: body.phone ?? existing.phone,
    };
    partnersStore.set(id, updated);
    return c.json({ partner: toPartnerResponse(updated) });
}

function toPartnerResponse(p: FreeePartnerRecord) {
    return {
        id: p.id,
        company_id: p.company_id,
        name: p.name,
        code: p.code,
        shortcut1: p.shortcut1,
        shortcut2: p.shortcut2,
        address_attributes: p.address_attributes,
        contact_name: p.contact_name,
        email: p.email,
        phone: p.phone,
    };
}
