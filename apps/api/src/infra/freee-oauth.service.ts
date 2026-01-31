import type { FreeeCompany, FreeeOAuthService, FreeeOAuthTokens } from "~/domain/freee";

const FREEE_AUTH_URL = "https://accounts.secure.freee.co.jp/public_api/authorize";
const FREEE_TOKEN_URL = "https://accounts.secure.freee.co.jp/public_api/token";
const FREEE_API_URL = "https://api.freee.co.jp";

export class FreeeOAuthServiceImpl implements FreeeOAuthService {
    constructor(
        private readonly clientId: string,
        private readonly clientSecret: string,
    ) {}

    getAuthorizationUrl(state: string, redirectUri: string): string {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            state,
        });

        return `${FREEE_AUTH_URL}?${params.toString()}`;
    }

    async exchangeCodeForTokens(code: string, redirectUri: string): Promise<FreeeOAuthTokens> {
        const response = await fetch(FREEE_TOKEN_URL, {
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

        const data = (await response.json()) as {
            access_token: string;
            refresh_token: string;
            expires_in: number;
            token_type: string;
            scope: string;
            created_at: number;
        };

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
        const response = await fetch(FREEE_TOKEN_URL, {
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

        const data = (await response.json()) as {
            access_token: string;
            refresh_token: string;
            expires_in: number;
            token_type: string;
            scope: string;
            created_at: number;
        };

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
        const response = await fetch(`${FREEE_API_URL}/api/1/companies`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to get companies: ${response.status} ${errorBody}`);
        }

        const data = (await response.json()) as {
            companies: Array<{
                id: number;
                display_name: string;
                role: string;
            }>;
        };

        return data.companies.map((c) => ({
            id: c.id,
            displayName: c.display_name,
            role: c.role,
        }));
    }
}
