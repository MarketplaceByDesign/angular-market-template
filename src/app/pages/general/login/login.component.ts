import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AuthenticationService,
    AuthHolderService,
    LoginRequest,
    LoginResponse,
    NativeLoginService,
    SiteAuthConfig,
} from '@mbd-common-libs/angular-common-services';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, finalize, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ComponentsUserLoginModel } from '@mbd-common-libs/angular-common-components';
import { CmsContentService } from '@core/services/cms-content-service/cms-content-service.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    private readonly SAML_JWT_ACCESS_TOKEN_KEY = 'jwtAccessToken';
    private readonly SAML_JWT_REFRESH_TOKEN_KEY = 'jwtRefreshToken';
    // For SP initiated flow use 'SP'
    private readonly SAML_AUTH_INITIATED_FLOW = 'IDP';

    signupUrl = '/signup';
    forgotPwdUrl = '/forgot-password';
    signIn = new ComponentsUserLoginModel();
    inProcess = false;
    isLoading = false;

    isSsoLogin = true;

    cmsData = {
        loginImageURL: '',
    };
    private destroy$: Subject<void> = new Subject();
    private loader: LoadingBarState;
    private returnUrl: string;
    private redirectUri: string = window.location.origin + '/login';
    private authConfig: SiteAuthConfig;

    constructor(
        public loadingBar: LoadingBarService,
        private router: Router,
        private route: ActivatedRoute,
        private authHolderService: AuthHolderService,
        private oauthService: OAuthService,
        private openIdAuthService: AuthenticationService,
        private nativeLoginService: NativeLoginService,
        private toastService: ToastrService,
        private cmsService: CmsContentService,
    ) {}

    ngOnInit(): void {
        this.loader = this.loadingBar.useRef();

        // get redirect URL from the params
        this.retrieveRedirectUrl();

        const samlJwtTokens = this.getSamlJwtTokens();

        if (this.authHolderService.isLoggedInUser()) {
            this.router.navigate(['']).then();
        } else if (samlJwtTokens) {
            this.processLoginResponse(samlJwtTokens, this.returnUrl);
        } else {
            this.loader.start();

            this.setupLoginFlowResponseProcess();

            this.openIdAuthService
                .getAuthConfig()
                .pipe(
                    tap(value => (this.isSsoLogin = !!value)),
                    filter(value => !!value),
                    takeUntil(this.destroy$),
                )
                .subscribe(
                    authConfig => {
                        this.authConfig = authConfig;

                        const code = this.route.snapshot.queryParamMap.get('code');

                        if (authConfig?.type === 'SAML_20') {
                            // SAML 2.0 login
                            this.processSamlLogin(authConfig);
                        } else if (code && this.isClientAccessTypeConfidential()) {
                            if (this.checkState()) {
                                this.openIdAuthService
                                    .verifyCode(code, this.redirectUri)
                                    .pipe(takeUntil(this.destroy$))
                                    .subscribe(
                                        response => {
                                            this.processLoginResponse(response, this.returnUrl);
                                            this.loader.complete();
                                        },
                                        () => this.oauthService.logOut(true),
                                    );
                            } else {
                                // tslint:disable-next-line:no-console
                                console.error('State is incorrect');
                            }
                        } else {
                            this.configureOAuthService();

                            this.oauthService
                                .loadDiscoveryDocumentAndLogin({
                                    state: this.returnUrl,
                                })
                                .then(() => {
                                    this.loader.complete();
                                });
                        }
                    },
                    () => (this.isSsoLogin = false),
                    () => this.loader.complete(),
                );
        }

        this.initCMSData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.loader.complete();
    }

    login(event: boolean): void {
        if (event === true) {
            this.inProcess = true;
            this.nativeLoginService
                .signIn(this.signIn)
                .pipe(
                    finalize(() => {
                        this.inProcess = false;
                    }),
                    takeUntil(this.destroy$),
                )
                .subscribe((response: LoginResponse) => {
                    this.processLoginResponse(response, this.returnUrl);
                });
        }
    }

    sendActivationEmail(email: string): void {
        this.nativeLoginService
            .sendActivationCode(email)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.toastService.success('Activation email was sent to your inbox!');
            });
    }

    private setupLoginFlowResponseProcess(): void {
        this.oauthService.events.pipe(takeUntil(this.destroy$)).subscribe(oAuthEvent => {
            if (oAuthEvent.type === 'token_received') {
                this.loader.start();
                this.openIdAuthService
                    .login(new LoginRequest(this.oauthService.getIdToken(), this.oauthService.getAccessToken()))
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(
                        (response: LoginResponse) => {
                            const redirectUri =
                                this.authConfig.grantType === 'authorization_code'
                                    ? decodeURIComponent(this.oauthService.state)
                                    : this.oauthService.state;
                            this.processLoginResponse(response, redirectUri);
                            this.loader.complete();
                        },
                        () => this.oauthService.logOut(true),
                    );
            }
        });
    }

    private checkState(): boolean {
        const stateParam = this.route.snapshot.queryParamMap.get('state');
        const state = stateParam.split(';')[0];
        const encodedUriPart = stateParam.split(';')[1];
        this.returnUrl = encodedUriPart ? decodeURIComponent(encodedUriPart) : null;

        return state === sessionStorage.getItem('nonce');
    }

    private configureOAuthService(): void {
        this.oauthService.configure({
            ...this.authConfig,
            responseType: this.authConfig.grantType === 'implicit' ? '' : 'code',
            disablePKCE: this.isClientAccessTypeConfidential(),
            redirectUri: this.redirectUri,
            strictDiscoveryDocumentValidation: false,
        });
    }

    private isClientAccessTypeConfidential(): boolean {
        return this.authConfig.clientAccessType === 'confidential';
    }

    private retrieveRedirectUrl(): void {
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '';
    }

    private processLoginResponse(response: LoginResponse, redirectUrl: string): void {
        this.authHolderService.persist(response.accessToken, response.refreshToken);
        this.router.navigateByUrl(redirectUrl || '').then();
    }

    private processSamlLogin(authConfig: SiteAuthConfig): void {
        this.loader.complete();
        if (this.SAML_AUTH_INITIATED_FLOW === 'IDP') {
            const samlLoginUrl = new URL(authConfig.singleSignOnUrl);
            samlLoginUrl.searchParams.append('RelayState', window.location.href);
            window.open(samlLoginUrl.toString(), '_self');
        } else {
            this.openIdAuthService
                .authRequest(window.location.href)
                .pipe(takeUntil(this.destroy$))
                .subscribe(url => {
                    window.open(url, '_self');
                });
        }
    }

    private getSamlJwtTokens(): LoginResponse {
        const queryParamMap = this.route.snapshot.queryParamMap;
        if (queryParamMap.has(this.SAML_JWT_ACCESS_TOKEN_KEY) && queryParamMap.has(this.SAML_JWT_REFRESH_TOKEN_KEY)) {
            return {
                accessToken: queryParamMap.get(this.SAML_JWT_ACCESS_TOKEN_KEY),
                refreshToken: queryParamMap.get(this.SAML_JWT_REFRESH_TOKEN_KEY),
            };
        }
        return null;
    }

    private initCMSData(): void {
        this.cmsService
            .getContentByPaths({
                loginImageURL: 'login.logo',
            })
            .subscribe(content => {
                this.cmsData.loginImageURL = content.loginImageURL as string;
            });
    }
}
