import type { FreeeOAuthService } from "~/domain/freee";

export class GetFreeeAuthUrlUseCase {
    constructor(private readonly oauthService: FreeeOAuthService) {}

    execute(state: string, redirectUri: string): string {
        return this.oauthService.getAuthorizationUrl(state, redirectUri);
    }
}
