import type { Hono } from "hono";
import {
    getAuthorize,
    getCompanies,
    getPartnerById,
    getPartners,
    postPartner,
    postToken,
    putPartner,
} from "../apis/freee/index.js";

export function registerFreeeRoutes(app: Hono): void {
    app.get("/public_api/authorize", getAuthorize);
    app.post("/public_api/token", postToken);
    app.get("/api/1/companies", getCompanies);
    app.get("/api/1/partners", getPartners);
    app.get("/api/1/partners/:id", getPartnerById);
    app.post("/api/1/partners", postPartner);
    app.put("/api/1/partners/:id", putPartner);
}
