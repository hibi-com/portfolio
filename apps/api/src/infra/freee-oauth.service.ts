import type { FreeeCompany, FreeeOAuthService, FreeeOAuthTokens } from "~/domain/freee";

const DEFAULT_FREEE_AUTH_BASE = "https://accounts.secure.freee.co.jp";
const DEFAULT_FREEE_API_BASE = "https://api.freee.co.jp";

export class FreeeOAuthServiceImpl implements FreeeOAuthService {
    private readonly authBase: string;
    private readonly apiBase: string;

    constructor(
        private readonly clientId: string,
        private readonly clientSecret: string,
        freeeAuthBaseUrl?: string,
        freeeApiBaseUrl?: string,
    ) {
        this.authBase = freeeAuthBaseUrl?.replace(/\/$/, "") ?? DEFAULT_FREEE_AUTH_BASE;
        this.apiBase = freeeApiBaseUrl?.replace(/\/$/, "") ?? DEFAULT_FREEE_API_BASE;
    }

    getAuthorizationUrl(state: string, redirectUri: string): string {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            state,
        });

        return `${this.authBase}/public_api/authorize?${params.toString()}`;
    }

    async exchangeCodeForTokens(code: string, redirectUri: string): Promise<FreeeOAuthTokens> {
        const tokenUrl = `${this.authBase}/public_api/token`;
        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code,
                redirect_uri: redirectUri,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to exchange code for tokens: ${response.status} ${errorBody}`);
        }

        type TokenResponse = {
            access_token: string;
            refresh_token: string;
            expires_in: number;
            token_type: string;
            scope: string;
            created_at: number;
        };
        const data: TokenResponse = await response.json();

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
            tokenType: data.token_type,
            scope: data.scope,
            createdAt: data.created_at,
        };
    }

    async refreshTokens(refreshToken: string): Promise<FreeeOAuthTokens> {
        const tokenUrl = `${this.authBase}/public_api/token`;
        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                client_id: this.clientId,
                client_secret: this.clientSecret,
                refresh_token: refreshToken,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to refresh tokens: ${response.status} ${errorBody}`);
        }

        type TokenResponse = {
            access_token: string;
            refresh_token: string;
            expires_in: number;
            token_type: string;
            scope: string;
            created_at: number;
        };
        const data: TokenResponse = await response.json();

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
            tokenType: data.token_type,
            scope: data.scope,
            createdAt: data.created_at,
        };
    }

    async getCompanies(accessToken: string): Promise<FreeeCompany[]> {
        const response = await fetch(`${this.apiBase}/api/1/companies`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to get companies: ${response.status} ${errorBody}`);
        }

        type CompaniesResponse = {
            companies: Array<{
                id: number;
                display_name: string;
                role: string;
            }>;
        };
        const data: CompaniesResponse = await response.json();

        return data.companies.map((c) => ({
            id: c.id,
            displayName: c.display_name,
            role: c.role,
        }));
    }
}
