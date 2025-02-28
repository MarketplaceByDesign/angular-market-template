import { Component, OnDestroy, OnInit } from '@angular/core';
import { NativeLoginService } from '@mbd-common-libs/angular-common-services';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { OcEditUserFormConfig, OcEditUserResult, SignupRouterState } from '@mbd-common-libs/angular-common-components';
import { OcEditUserTypeService } from '@core/services/user-type-service/user-type.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
    private readonly formConfigsWithoutTypeData: OcEditUserFormConfig[] = [
        {
            name: 'Default',
            organization: {
                type: 'default',
                typeData: null,
                includeFields: ['name', 'customData.company'],
            },
            account: {
                type: 'default',
                typeData: null,
                includeFields: ['name', 'email'],
            },
            fieldsOrder: ['name', 'email', 'org--name', 'password'],
        },
        {
            name: 'Custom',
            organization: {
                type: 'custom-user-type',
                typeData: null,
                includeFields: ['name', 'customData.about-my-company', 'customData.dynamic-field-array'],
            },
            account: {
                type: 'custom-account-type',
                typeData: null,
                includeFields: ['name', 'username', 'email', 'customData.about-me'],
            },
        },
    ];

    loginUrl = '/login';
    companyLogoUrl = './assets/img/company-logo-2x.png';
    termsAndConditionPageUrl = 'https://my.openchannel.io/terms-of-service';
    dataProcessingPolicyUrl = 'https://my.openchannel.io/data-processing-policy';
    forgotPasswordDoneIconPath = './assets/img/forgot-password-complete-icon.svg';
    showSignupFeedbackPage = false;
    inProcess = false;
    signupUrl = '/signup';
    activationUrl = '/activate';
    formConfigsLoading = true;
    formConfigs: OcEditUserFormConfig[];

    private destroy$: Subject<void> = new Subject();
    private loaderBar: LoadingBarState;

    constructor(
        private nativeLoginService: NativeLoginService,
        private loadingBarService: LoadingBarService,
        private ocEditTypeService: OcEditUserTypeService,
        private router: Router,
    ) {
        // this.router.getCurrentNavigation() works only in constructor
        const routerState = this.router.getCurrentNavigation().extras.state as SignupRouterState;
        this.showSignupFeedbackPage = routerState?.showSignupFeedbackPage || false;
    }

    ngOnInit(): void {
        this.loaderBar = this.loadingBarService.useRef();
        this.initFormConfigs();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.loaderBar.complete();
    }

    onSignup(userData: OcEditUserResult): void {
        if (userData && !this.inProcess) {
            this.inProcess = true;
            this.nativeLoginService
                .signup({
                    account: userData?.account,
                    organization: userData?.organization,
                    password: userData?.password,
                })
                .pipe(
                    finalize(() => {
                        this.inProcess = false;
                    }),
                    takeUntil(this.destroy$),
                )
                .subscribe(() => {
                    this.showSignupFeedbackPage = true;
                });
        }
    }

    private initFormConfigs(): void {
        this.loaderBar.start();
        this.ocEditTypeService
            .injectTypeDataIntoConfigs(this.formConfigsWithoutTypeData, true, true)
            .pipe(
                finalize(() => {
                    this.loaderBar.complete();
                    this.formConfigsLoading = false;
                }),
                takeUntil(this.destroy$),
            )
            .subscribe(formConfigs => {
                this.formConfigs = formConfigs;
            });
    }
}
