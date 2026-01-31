import type { FreeeIntegration, FreeeOAuthService, FreeeRepository } from "~/domain/freee";

export class HandleFreeeCallbackUseCase {
    constructor(
        private readonly freeeRepository: FreeeRepository,
        private readonly oauthService: FreeeOAuthService,
    ) {}

    async execute(code: string, redirectUri: string, userId: string): Promise<FreeeIntegration> {
        const tokens = await this.oauthService.exchangeCodeForTokens(code, redirectUri);
        const companies = await this.oauthService.getCompanies(tokens.accessToken);

        const primaryCompany = companies[0];
        if (!primaryCompany) {
            throw new Error("No companies found for this freee account");
        }

        const existingIntegration = await this.freeeRepository.findIntegrationByCompanyId(userId, primaryCompany.id);

        if (existingIntegration) {
            return this.freeeRepository.updateTokens(existingIntegration.id, {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                tokenExpiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
            });
        }

        return this.freeeRepository.createIntegration({
            userId,
            companyId: primaryCompany.id,
            companyName: primaryCompany.displayName,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            tokenExpiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
            scopes: tokens.scope.split(" "),
        });
    }
}
