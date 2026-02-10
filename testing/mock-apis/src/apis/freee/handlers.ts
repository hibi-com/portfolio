/**
 * @see https://developer.freee.co.jp/reference
 */

import { URL } from "node:url";
import type { Context } from "hono";
import { requireAuth } from "../../lib/auth.js";
import { badRequest, notFound, unauthorized } from "../../lib/response.js";
import {
    MOCK_ACCESS_TOKEN,
    MOCK_COMPANY_ID,
    MOCK_COMPANY_NAME,
    MOCK_REFRESH_TOKEN,
    TOKEN_EXPIRES_IN,
} from "./constants.js";
import { partnersStore } from "./store.js";
import type {
    FreeeCompany,
    FreeePartnerCreateRequest,
    FreeePartnerRecord,
    FreeePartnerUpdateRequest,
    FreeeTokenResponse,
} from "./types.js";

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

function createTokenResponse(): FreeeTokenResponse {
    return {
        access_token: MOCK_ACCESS_TOKEN,
        refresh_token: MOCK_REFRESH_TOKEN,
        expires_in: TOKEN_EXPIRES_IN,
        token_type: "bearer",
        scope: "companies",
        created_at: Math.floor(Date.now() / 1000),
    };
}

export function getAuthorize(c: Context) {
    const redirectUri = c.req.query("redirect_uri");
    const state = c.req.query("state");

    if (!redirectUri) {
        return badRequest(c, "redirect_uri required");
    }

    const url = new URL(redirectUri);
    url.searchParams.set("code", "mock_auth_code");
    if (state) url.searchParams.set("state", state);

    return c.redirect(url.toString(), 302);
}

export async function postToken(c: Context) {
    const body = await c.req.parseBody();
    const grantType = body.grant_type as string;

    if (grantType === "authorization_code" || grantType === "refresh_token") {
        return c.json(createTokenResponse());
    }

    return badRequest(c, "unsupported_grant_type");
}

export function getCompanies(c: Context) {
    if (!requireAuth(c)) {
        return unauthorized(c);
    }

    const companies: FreeeCompany[] = [
        {
            id: MOCK_COMPANY_ID,
            display_name: MOCK_COMPANY_NAME,
            role: "admin",
        },
    ];

    return c.json({ companies });
}

export function getPartners(c: Context) {
    if (!requireAuth(c)) {
        return unauthorized(c);
    }

    const companyId = Number(c.req.query("company_id")) || MOCK_COMPANY_ID;
    const limit = Number(c.req.query("limit")) || 100;

    const list = partnersStore.getAll(companyId, limit);
    const partners = list.map(toPartnerResponse);

    return c.json({ partners });
}

export function getPartnerById(c: Context) {
    if (!requireAuth(c)) {
        return unauthorized(c);
    }

    const id = Number(c.req.param("id"));
    const partner = partnersStore.getById(id);

    if (!partner) {
        return notFound(c);
    }

    return c.json({ partner: toPartnerResponse(partner) });
}

export async function postPartner(c: Context) {
    if (!requireAuth(c)) {
        return unauthorized(c);
    }

    const body: FreeePartnerCreateRequest = await c.req.json();

    const record = partnersStore.create({
        company_id: body.company_id ?? MOCK_COMPANY_ID,
        name: body.name ?? "",
        code: body.code,
        email: body.email,
        phone: body.phone,
    });

    return c.json({ partner: toPartnerResponse(record) }, 201);
}

export async function putPartner(c: Context) {
    if (!requireAuth(c)) {
        return unauthorized(c);
    }

    const id = Number(c.req.param("id"));
    const body: FreeePartnerUpdateRequest = await c.req.json();

    const updated = partnersStore.update(id, {
        name: body.name,
        code: body.code,
        email: body.email,
        phone: body.phone,
    });

    if (!updated) {
        return notFound(c);
    }

    return c.json({ partner: toPartnerResponse(updated) });
}
