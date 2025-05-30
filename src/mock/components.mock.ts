import { Component, EventEmitter, Input, Output, TemplateRef, forwardRef } from '@angular/core';
import {
    ComponentsUserActivationModel,
    ComponentsUserGridActionModel,
    ComponentsUsersGridParametersModel,
    ErrorMessage,
    ErrorMessageFormId,
    HeadingTag,
    ModalInviteUserModel,
    ModalUpdateUserModel,
    SocialLink,
    SortField,
    TransformTextType,
    UserGridSortOrder,
    UserSortChosen,
} from '@mbd-common-libs/angular-common-components';
import { AbstractControl, AbstractControlDirective, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';

@Component({
    selector: 'oc-error',
    template: '',
})
export class MockErrorComponent {
    @Input() control: AbstractControlDirective | AbstractControl | NgModel;
    @Input() field: string;
    @Input() formId: ErrorMessageFormId;
    @Input() modifyErrors: string;
    @Input() updateMessages: ErrorMessage;
}

@Component({
    selector: 'oc-select',
    template: '',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MockSelectComponent),
            multi: true,
        },
    ],
})
export class MockSelectComponent implements ControlValueAccessor {
    @Input() selectValArr: any | object[] = [];
    @Input() form: FormControl;
    @Input() formControl: AbstractControl;
    @Input() transformText: TransformTextType;
    registerOnChange(fn: any): void {}
    registerOnTouched(fn: any): void {}
    writeValue(obj: any): void {}
}

@Component({
    selector: 'oc-label',
    template: '',
})
export class MockLabelComponent {
    /** Label text */
    @Input() text: string = '';
    /** Show indicator of required field */
    @Input() required: boolean = false;
    /** Set global classes for label */
    @Input() class: string = '';
}

@Component({
    selector: 'oc-input',
    template: '',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MockInputComponent),
            multi: true,
        },
    ],
})
export class MockInputComponent implements ControlValueAccessor {
    @Input() placeholder: string = '';
    registerOnChange(fn: any): void {}
    registerOnTouched(fn: any): void {}
    writeValue(obj: any): void {}
}

@Component({
    selector: 'app-billing',
    template: '',
})
export class MockBillingComponent {}

@Component({
    selector: 'app-billing-history',
    template: '',
})
export class MockBillingHistoryComponent {}

@Component({
    selector: 'app-button-action',
    template: '',
})
export class MockButtonActionComponent {
    @Input() buttonAction: any;
    @Input() appData: any;
    @Input() viewType: string = 'button';
    @Output() readonly updateAppData: EventEmitter<void> = new EventEmitter<void>();
}

@Component({
    selector: 'app-change-password',
    template: '',
})
export class MockChangePasswordComponent {}

@Component({
    selector: 'app-collapse-with-title',
    template: '',
})
export class MockCollapseWithTitleComponent {
    @Input() titleForClose: string;
    @Input() titleForOpen: string;
    @Input() collapsed = true;
    @Output() readonly collapseChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}

@Component({
    selector: 'app-company-details',
    template: '',
})
export class MockCompanyDetailsComponent {}

@Component({
    selector: 'app-general-profile',
    template: '',
})
export class MockGeneralProfileComponent {}

@Component({
    selector: 'app-management',
    template: '',
})
export class MockManagementComponent {}

@Component({
    selector: 'app-notification',
    template: '',
})
export class MockNotificationComponent {}

@Component({
    selector: 'app-page-title',
    template: '',
})
export class MockPageTitleComponent {
    @Input() pageTitle: string;
    @Input() navigateText: string;
    @Input() buttonText: string;
    @Output() readonly navigateClick: EventEmitter<void> = new EventEmitter<void>();
    @Output() readonly buttonClick: EventEmitter<void> = new EventEmitter<void>();
}

@Component({
    selector: 'oc-activation',
    template: '',
})
export class MockOcActivationComponent {
    @Input() resendActivationUrl: any;
    @Input() signupUrl: any;
    @Input() companyLogoUrl: string = '';
    @Input() process: boolean = false;
    @Input() activationModel: ComponentsUserActivationModel;
    @Output() readonly buttonClick: EventEmitter<any> = new EventEmitter<any>();
    @Input() headingTag: HeadingTag = 'h1';
}

@Component({
    selector: 'app-billing-form',
    template: '',
})
export class MockAppBillingForm {
    @Input() goBackOnCancel: boolean = false;
    @Input() successButtonText: string = '';
    @Input() categoryRouterLink: string = '';
    @Input() successToasterMessage: string = '';
    @Input() additionalFieldsTemplate: TemplateRef<any>;
    @Input() process: any;
    @Input() additionalButtonLock: boolean = false;

    @Output() readonly cardDataLoaded: EventEmitter<any> = new EventEmitter<any>();
    @Output() readonly successButtonPressed: EventEmitter<any> = new EventEmitter<any>();
    @Output() readonly successAction: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
    selector: 'oc-profile-navbar',
    template: '',
})
export class MockOcProfileNavbar {
    @Input() username: string;
}
@Component({
    selector: 'oc-app-categories',
    template: '',
})
export class MockAppCategoriesComponent {
    @Input() data: any[] = [];
    @Input() categoryHeaderTitle: string = '';
    @Input() categoryRouterLink: string = '';
}

@Component({
    selector: 'oc-app-gallery',
    template: '',
})
export class MockAppGalleryComponent {
    @Input() appsArr: any[] = [];
    @Input() noAppMessage: string = '';
    @Input() moreAppsTitle: string = 'More';
    @Input() appGalleryTitle: string = '';
    @Input() appGalleryDescription: string = '';
    @Input() routerIcon: string = '';
    @Input() customAppCardTemplate: TemplateRef<any>;
    @Input() seeAllUrl: string | any[];
    @Input() routerLinkForOneApp: string;
    @Input() appNavigationParam: string = 'appId';
    @Input() headingTag: string = 'h2';
    @Output() readonly clickMoreApps: EventEmitter<void> = new EventEmitter<void>();
}

@Component({
    selector: 'oc-app-get-started',
    template: '',
})
export class MockAppGetStartedComponent {
    @Input() getStartedImage: string = '';
    @Input() getStartedHeader: string = 'List Your App in our App Store';
    @Input() getStartedHeadingTag: string = 'h3';
    @Input() getStartedDescription: string = '';
    @Input() getStartedButtonText: string = '';
    @Input() getStartedType: 'home' | 'search' = 'home';
    @Output() readonly getStarted: EventEmitter<void> = new EventEmitter<void>();
}

@Component({
    selector: 'oc-app-list-grid',
    template: '',
})
export class MockOcAppListGridComponent {
    @Input() appList: any;
    @Input() baseLinkForOneApp: string = '';
    @Input() appNavigationParam: string = '';
    @Input() defaultAppIcon: string = '';
}

@Component({
    selector: 'oc-app-short-info',
    template: '',
})
export class MockAppShortInfoComponent {
    @Input() app: any;
    @Input() priceModelIndex: number = 0;
    @Input() customDropdown: TemplateRef<any>;
    @Input() defaultAppIcon: string = 'assets/angular-common-components/standard-app-icon.svg';
    @Output() readonly clickByAppCard: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
    selector: 'oc-app-table',
    template: '',
})
export class MockAppTableComponent {
    @Input() properties: any;
    @Input() noAppMessage: string = 'You have no apps in your list';
    @Input() menuUrl: string = 'assets/angular-common-components/dots-menu.svg';
    @Input() ascendingSortIcon: string = '';
    @Input() descendingSortIcon: string = '';
    @Input() defaultAppIcon: string = '';
    @Input() activeColumns: any[] = [];
    @Input() modifyColumns: any = {};
    @Input() sortOptions: any;
    @Input() tableBottomRowTemplate: TemplateRef<any>;
    @Input() selectAppFieldByPathConfig: any;
    @Output() readonly menuClicked: EventEmitter<any> = new EventEmitter<any>();
    @Output() readonly pageScrolled: EventEmitter<number> = new EventEmitter<number>();
    @Output() readonly sortChosen: EventEmitter<any> = new EventEmitter<any>();
    @Output() readonly sortOptionsChosen: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
    selector: 'oc-button',
    template: '',
})
export class MockButtonComponent {
    @Input() text: string = '';
    @Input() disabled: boolean = false;
    @Input() type: 'primary' | 'secondary' | 'link' = 'primary';
    @Input() customClass: string;
    @Input() style: string;
    @Input() process: boolean;
    @Input() customTemplate: TemplateRef<any>;
    @Output() readonly click: EventEmitter<void> = new EventEmitter<void>();
}

@Component({
    selector: 'oc-confirmation-modal',
    template: '',
})
export class OcConfirmationModalComponent {
    @Input() modalTitle: string = '';
    @Input() modalText: string = '';
    @Input() confirmButtonText: string = 'Ok';
    @Input() confirmButtonType: 'primary' | 'secondary' | 'link' | 'danger' = 'primary';
    @Input() confirmButtonHide: boolean = false;
    @Input() rejectButtonText = 'No, cancel';
    @Input() rejectButtonType: 'primary' | 'secondary' | 'link' | 'danger' = 'secondary';
    @Input() rejectButtonHide: boolean = false;
    @Input() confirmButtonClass: string = '';
}

@Component({
    selector: 'oc-consent',
    template: '',
})
export class MockOcConsentComponent {
    @Input() policyUrl: string = '';
    @Input() termsUrl: string = '';
}

@Component({
    selector: 'oc-dropdown',
    template: '',
})
export class MockDropdownComponent {
    @Input() selected: any;
    @Input() title: string = 'Sort by';
    @Input() options: any[];
    @Output() readonly selectedChange: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
    selector: 'oc-edit-user-form',
    template: '',
})
export class MockEditUserFormComponent {
    @Input() formConfigs: any[];
    @Input() enableTypesDropdown = false;
    @Input() enablePasswordField = false;
    @Input() enableTermsCheckbox: any;
    @Input() defaultTypeLabelText = 'Type';
    @Input() defaultAccountData: any;
    @Input() defaultOrganizationData: any;
    @Input() defaultEmptyConfigsErrorTemplate: TemplateRef<any>;
    @Input() defaultEmptyConfigsErrorMessage: string = 'There are no forms configured';
    @Input() customTermsDescription: TemplateRef<any>;
    @Input() formId: any = 'editUser';
    @Output() readonly resultFormDataChange = new EventEmitter<any>();
    @Output() readonly createdFormGroup = new EventEmitter<any>();
}

@Component({
    selector: 'oc-featured-apps',
    template: '',
})
export class MockFeaturedAppsComponent {
    @Input() data: any[] = [];
    @Input() label: string = 'Featured';
    @Input() headingTag: string = 'h2';
    @Input() appHeadingTag: string = 'h3';
    @Input() emptyDataMessage: string = 'No Featured App';
    @Input() customClasses: string = '';
    @Input() customFeaturedAppCardTemplate: TemplateRef<any>;
    @Input() mainRouterLink: string = '';
    @Input() navigationParam: string;
}

@Component({
    selector: 'oc-forgot-password',
    template: '',
})
export class MockOcForgotPasswordComponent {
    @Input() loginUrl: any;
    @Input() signupUrl: any;
    @Input() showResultPage: any;
    @Input() forgotPasswordDoneUrl: any;
    @Input() companyLogoUrl: any;
    @Input() process: any;
    @Input() loginModel: any;
    @Output() readonly buttonClick: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
    selector: 'oc-form',
    template: '',
})
export class MockFormComponent {
    @Input() formJsonData: any;
    @Input() showButton: boolean = true;
    @Input() buttonPosition: 'center' | 'left' | 'right' | 'justify' = 'left';
    @Input() successButtonText: string = 'Submit';
    @Input() labelPosition: 'top' | 'left' | 'right' = 'top';
    @Input() process: boolean = false;
    @Input() generatedForm: any;
    @Output() readonly formSubmitted: EventEmitter<any> = new EventEmitter();
    @Output() readonly cancelSubmit: EventEmitter<void> = new EventEmitter();
    @Output() readonly formDataUpdated: EventEmitter<any> = new EventEmitter();
    @Output() readonly isFormInvalid: EventEmitter<boolean> = new EventEmitter();
    @Output() readonly createdForm: EventEmitter<any> = new EventEmitter();
    @Input() displayType: any = 'page';
    @Input() additionalButton: TemplateRef<any>;
    @Input() currentStep: number = 1;
    @Input() maxStepsToShow: number = 0;
    @Input() formId: any = null;
    @Output() readonly currentStepChange = new EventEmitter<number>();
    @Input() showSubmitButton: boolean = true;
    @Input() showGroupHeading: boolean = true;
    @Input() showGroupDescription: boolean = true;
    @Input() showProgressBar: boolean = true;
    @Input() setFormErrors: boolean = false;
}

@Component({
    selector: 'oc-invite-modal',
    template: '',
})
export class MockOcInviteModalComponent {
    @Input() modalData: ModalInviteUserModel | ModalUpdateUserModel;
    @Input() formId: ErrorMessageFormId = null;
    formConfig: any = {};
    formGroup: any;
    formData: any;
    inProcess = false;
}

@Component({
    selector: 'oc-login',
    template: '',
})
export class MockOcLoginComponent {
    @Input() loginModel: any = {};
    @Input() loginButtonText: string = 'Log in';
    @Input() forgotPwdUrl: string;
    @Input() signupUrl: string;
    @Input() companyLogoUrl: string = './assets/angular-common-components/logo-company.png';
    @Input() process: boolean = false;
    @Input() incorrectEmailErrorCode: string = 'email_is_incorrect';
    @Input() incorrectEmailErrorCodeTemplate: TemplateRef<any>;
    @Input() notVerifiedEmailErrorCode: string = 'email_not_verified';
    @Input() notVerifiedEmailErrorTemplate: TemplateRef<any>;
    @Input() passwordResetRequiredErrorCode: string = 'password_reset_required';
    @Input() passwordResetRequiredErrorTemplate: TemplateRef<any>;
    @Input() headingTag: string = 'h1';
    @Output() readonly loginModelChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() readonly submit: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() readonly sendActivationLink: EventEmitter<string> = new EventEmitter<string>();
}

@Component({
    selector: 'oc-menu-user-grid',
    template: '',
})
export class MockOcMenuUserGridComponent {
    @Input() properties: ComponentsUsersGridParametersModel;
    @Input() menuUrl: string = 'assets/angular-common-components/dots-menu.svg';
    @Input() sortIcon: string;
    @Input() sortOptions: UserGridSortOrder;
    @Output() readonly menuClicked: EventEmitter<ComponentsUserGridActionModel> = new EventEmitter<ComponentsUserGridActionModel>();
    @Output() readonly pageScrolled: EventEmitter<number> = new EventEmitter<number>();
    @Output() readonly sortChosen: EventEmitter<SortField> = new EventEmitter<SortField>();
    @Output() readonly sortOptionsChosen: EventEmitter<UserSortChosen> = new EventEmitter<UserSortChosen>();
}
@Component({
    selector: 'oc-resend-activation',
    template: '',
})
export class MockResendActivation {
    @Input() activationModel: any;
    @Input() loginUrl: string;
    @Input() signupUrl: string;
    @Input() companyLogoUrl: string;
    @Input() process: boolean = false;
    @Output() readonly buttonClick = new EventEmitter<any>();
}

@Component({
    selector: 'oc-reset-password',
    template: '',
})
export class MockOcResetPasswordComponent {
    @Input() companyLogoUrl: any;
    @Input() process: any;
    @Input() loginUrl: any;
    @Input() signupUrl: any;
    @Output() readonly buttonClick: EventEmitter<any> = new EventEmitter<any>();
    @Input() resetModel: any;
}

@Component({
    selector: 'oc-sidebar',
    template: '',
})
export class MockSidebarComponent {
    @Input() title: string;
    @Input() titleHeadingTag: string = 'h2';
    @Input() sidebarModel: any;
    @Input() toggleIconDown: string = '';
    @Input() toggleIconUp: string = '';
    @Input() baseNavigation: string;
    @Input() threshold: number = 10;
    @Input() expandText: string = 'Show more';
    @Input() collapseText: string = 'Show less';
    @Input() toggleListButtonType: 'primary' | 'link' = 'link';
    @Input() ngbCollapse: any;
    @Output() readonly sidebarChange: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
    selector: 'oc-signup-custom',
    template: '',
})
export class MockSignupCustom {
    @Input() loginUrl: string;
    @Input() signupUrl: string;
    @Input() activationUrl: string;
    @Input() termsUrl: string;
    @Input() policyUrl: string;
    @Input() companyLogoUrl: string;
    @Input() process: boolean = false;
    @Input() forgotPasswordDoneUrl: string;
    @Input() showSignupFeedbackPage: boolean = false;
    @Input() showLoginLink: boolean = true;
    @Input() formConfigsLoading: boolean = true;
    @Input() formConfigs: any[];
    @Input() defaultTypeLabelText = 'Type';
    @Input() customTermsDescription: TemplateRef<any>;
    @Input() headingTag: string = 'h1';
    @Input() headingInvitationText: string = 'Enter your personal details below';
    @Input() formId: any = 'signupCustom';
    @Input() customFormTemplate: TemplateRef<any>;
    @Output() readonly showSignupFeedbackPageChange = new EventEmitter<boolean>();
    @Output() readonly resultUserData = new EventEmitter<any>();
}

@Component({
    selector: 'oc-social-links',
    template: '',
})
export class MockSocialLinks {
    @Input() socialLinks: SocialLink[];
}

@Component({
    selector: 'oc-text-search',
    template: '',
})
export class MockTextSearchComponent {
    @Input() clearAllButtonType: string = 'link';
    @Input() showClearAllTagsButton: boolean = true;
    @Input() searchText: string;
    @Input() placeHolder: string = 'Search';
    @Input() hasMagnifier: boolean = true;
    @Input() hasClearTextControl: boolean = false;
    @Input() clearButtonText: string = 'Clear';
    @Input() searchButtonText: string = 'Search';
    @Input() clearTagsButtonText: string = 'Clear all';
    @Input() tagsTitles: string[] = [];
    @Output() readonly searchTextChange: EventEmitter<string> = new EventEmitter();
    @Output() readonly enterSearch: EventEmitter<string> = new EventEmitter<string>();
    @Output() readonly tagDeleted: EventEmitter<number> = new EventEmitter<number>();
    @Output() readonly allTagsDeleted: EventEmitter<void> = new EventEmitter<void>();
}

@Component({
    selector: 'mock-routing',
    template: '',
})
export class MockRoutingComponent {}

@Component({
    selector: 'ngx-loading-bar',
    template: '',
})
export class MockNgxLoadingBarComponent {
    @Input() includeSpinner: boolean = false;
}
export class MockNgbModalRef {
    result = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
    });
    resolve: any;
    reject: any;

    componentInstance: any = {};

    dismiss(): void {
        this.removeActiveModal();
        this.reject();
    }

    dismissAll():void{
        this.removeActiveModal();
        this.reject();
    };

    close(data?:any): void {
        this.removeActiveModal();
        this.resolve(data);
    }

    private removeActiveModal(): void {
        MockNgbModal.ACTIVE_MODALS.pop();
    }
}

@Component({
    selector: 'svg-icon',
    template: '',
})
export class MockSvgIconComponent {
    @Input() src: string;
    @Input() svgClass: string;
    @Input() ngbTooltip: string;
}

export class MockNgbModal {
    static ACTIVE_MODALS: MockNgbModalRef[] = [];

    open(): any {
        const newModal = new MockNgbModalRef();
        MockNgbModal.ACTIVE_MODALS.push(newModal);
        return newModal;
    }

    dismissAll(): any {
        return true;
    }

    hasOpenModals(): any {
        return true;
    }
}

export class MockNgbActiveModal {
    close(...args: any): void {
        // do nothing
    }
}
export class MockModalInviteUserModel {}

@Component({
    selector: 'oc-rating',
    template: '',
})
export class MockOcRatingComponent {
    @Input() type: 'single-star' | 'multi-star' = 'single-star';
    @Input() rating: number;
    @Input() reviewCount: number = 0;
    @Input() label: string = '';
    @Input() labelClass: string = 'medium md';
    @Input() disabled: boolean = false;
}

@Component({
    selector: 'oc-video',
    template: '',
})
export class MockOcVideoComponent {
    @Input() videoUrl: string = '';
}

@Component({
    selector: 'oc-image-gallery',
    template: '',
})
export class MockOcImageGalleryComponent {
    @Input() gallery: any = [];
    @Input() maxItems: number = 3;
    @Input() displayDetails: boolean = true;
    @Input() allowArrowControllers: boolean = false;
    @Input() mediaDimensions: any = {};
    @Input() expandOnClick: boolean = false;
    @Input() carouselOptions: any = {};
    @Input() componentIconsPath: any = {};
    @Input() imageModalIconsPath: any = {};
    @Input() isShowCounterInImageModal: boolean = false;
}

@Component({
    selector: 'oc-app-description',
    template: '',
})
export class MockOcAppDescriptionComponent {
    @Input() appDescription: string = '';
    @Input() header: string = '';
    @Input() headerTag: any = 'h4';
    @Input() showFullDescription: boolean = false;
    @Input() headerClass: string;
    @Input() enableTruncateTextLogic: boolean = true;
    @Input() truncateTextLength: number = 800;
    @Input() showMoreDescriptionText: string = 'Show more';
    @Input() showLessDescriptionText: string = 'Show less';
}

@Component({
    selector: 'oc-overall-rating',
    template: '',
})
export class MockOcOverallRatingComponent {
    @Input() overallReviewLabel: string = 'Overall rating';
    @Input() allReviewSummary: any = {};
}

@Component({
    selector: 'oc-review-list',
    template: '',
})
export class MockOcReviewListComponent {
    @Input() reviewListTitle: string = 'Most recent reviews';
    @Input() headingTag: any = 'h2';
    @Input() reviewHeadingTag: any = 'h3';
    @Input() totalReview: number;
    @Input() maxReviewDisplay: number = 3;
    @Input() noReviewMessage: string = 'There is no review for this app.';
    @Input() reviewsList: any = [];
    @Input() allowWriteReview: boolean = true;
    @Input() menuUrl: string = 'assets/angular-common-components/dots-menu.svg';
    @Input() currentUserId: string = '';
    @Output() readonly writeAReview: EventEmitter<any> = new EventEmitter<any>();
    @Output() readonly chosenAction: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
    selector: 'oc-review',
    template: '',
})
export class MockOcReviewComponent {
    @Input() heading: string = '';
    @Input() enableButtons: boolean = false;
    @Input() cancelButtonText: string = 'Cancel';
    @Input() submitButtonText: string = 'Submit';
    @Input() hidCancelButton: boolean = false;
    @Input() reviewData: any;
    @Input() submitInProgress: boolean = false;
    @Output() readonly reviewFormData: EventEmitter<any> = new EventEmitter<any>();
    @Output() readonly cancelReview: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() readonly isFormInvalid: EventEmitter<boolean> = new EventEmitter<boolean>();
}

@Component({
    selector: 'oc-recommended-apps',
    template: '',
})
export class MockOcRecomendedAppsComponent {
    @Input() appList: any[] = [];
    @Input() noAppMessage: string = '';
    @Input() recommendedAppTitle: string = 'Recommended Apps';
    @Input() headingTag: any = 'h2';
    @Input() customAppCardTemplate: TemplateRef<any>;
    @Input() routerLinkForOneApp: string | any;
    @Input() appNavigationParam: string;
    @Output() readonly clickByAppCard: EventEmitter<any> = new EventEmitter<any>();
}
