import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, AuthHolderService, SiteAuthConfig } from '@mbd-common-libs/angular-common-services';
import { from, Observable, of } from 'rxjs';
import { filter, first, map, mergeMap, skip, switchMap, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class LogOutService {
    private readonly samlLogoutParamKeys: string[] = ['SAMLResponse', 'SigAlg', 'Signature'];

    constructor(
        private oAuthService: OAuthService,
        private authService: AuthHolderService,
        private authenticationService: AuthenticationService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    /**
     * Remove URL param variables 'SAMLResponse', 'SigAlg' and 'Signature'.
     */
    removeSpecificParamKeyFromTheUrlForSaml2Logout(): void {
        this.activatedRoute.queryParamMap
        .pipe(
            skip(1),
            filter(queryParamMap => !!this.samlLogoutParamKeys.find(paramKey => queryParamMap.has(paramKey))),
            switchMap(() => {
                // map param values from ['key1', 'key2'] to {'key1': null, 'key2': null }
                const queryParams = {};
                this.samlLogoutParamKeys.forEach(paramKey => (queryParams[paramKey] = null));

                return from(
                    this.router.navigate([], {
                        queryParams,
                        queryParamsHandling: 'merge',
                    }),
                );
            }),
        )
        .subscribe();
    }

    logOut(): Observable<boolean> {
        return this.authenticationService.getAuthConfig().pipe(mergeMap(config => this.processNativeOrSSOLogout(config)));
    }

    logOutAndRedirect(navigateTo: string): void {
        this.authenticationService
        .getAuthConfig()
        .pipe(
            first(),
            mergeMap(config => this.processNativeOrSSOLogout(config, navigateTo)),
        )
        .subscribe();
    }

    private processNativeOrSSOLogout(config: SiteAuthConfig, navigateTo?: string): Observable<boolean> {
        if (!config) {
            // Native Logout
            return this.logOutNative().pipe(
                tap(() => this.authService.clearTokensInStorage()),
                switchMap(() => this.navigateByUrl(navigateTo)),
            );
        } else if (config.type === 'SAML_20') {
            // Saml 2.0 Logout
            return this.logOutNative().pipe(
                tap(() => this.authService.clearTokensInStorage()),
                switchMap(() => this.processSamlLogout(config)),
            );
        } else {
            // Auth2 Logout
            return this.logOutSSO(config).pipe(
                tap(() => this.authService.clearTokensInStorage()),
                switchMap(() => this.navigateByUrl(navigateTo)),
            );
        }
    }

    private processSamlLogout(config: SiteAuthConfig): Observable<boolean> {
        window.location.href = config.singleLogOutUrl;
        return of(true); // no redirect need for SAML 2.0, redirect URL configured on the SAML provider.
    }

    private isAuthorizationCodeFlow(authConfig: SiteAuthConfig): boolean {
        return authConfig.grantType === 'authorization_code' && authConfig.clientAccessType === 'confidential';
    }

    private logOutSSO(ssoConfig: SiteAuthConfig): Observable<boolean> {
        if (this.isAuthorizationCodeFlow(ssoConfig)) {
            return this.authenticationService.logOut().pipe(map(() => true));
        } else {
            this.oAuthService.configure({
                ...ssoConfig,
                postLogoutRedirectUri: window.location.origin,
                strictDiscoveryDocumentValidation: false,
            });
            return from(this.oAuthService.loadDiscoveryDocument()).pipe(
                mergeMap(() => this.authenticationService.logOut().pipe(first())),
                tap(() => this.oAuthService.logOut()),
                map(() => true),
            );
        }
    }

    private logOutNative(): Observable<boolean> {
        return this.authenticationService.logOut().pipe(
            first(),
            map(() => true),
        );
    }

    private navigateByUrl(navigateTo: string): Observable<boolean> {
        if (navigateTo?.length >= 0) {
            return from(this.router.navigateByUrl(navigateTo));
        } else {
            return of(true);
        }
    }
}
