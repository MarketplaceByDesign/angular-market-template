import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AppsService,
    ReviewsService,
    Page,
    AppVersionService,
    TitleService,
    FrontendService,
    StatisticService,
    SiteContentService,
    AuthHolderService,
} from '@mbd-common-libs/angular-common-services';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, Observable, throwError, of } from 'rxjs';
import { catchError, filter, map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { ActionButton, actionButtons, pageConfig } from 'assets/data/configData';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';
import { LoadingBarService } from '@ngx-loading-bar/core';
import {
    DropdownModel,
    FullAppData,
    OCReviewDetails,
    OverallRatingSummary,
    Review,
    ReviewListOptionType,
    Filter,
} from '@mbd-common-libs/angular-common-components';
import { HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { MarketMetaTagService } from '@core/services/meta-tag-service/meta-tag-service.service';
import { ButtonActionService } from '@features/button-action/button-action.service';

@Component({
    selector: 'app-app-detail',
    templateUrl: './app-detail.component.html',
    styleUrls: ['./app-detail.component.scss'],
})
export class AppDetailComponent implements OnInit, OnDestroy {
    app: FullAppData;
    recommendedApps: FullAppData[] = [];
    appData$: Observable<FullAppData>;
    overallRating: OverallRatingSummary = new OverallRatingSummary();

    // List of filters to create url to the search page if user clicks on the app category
    searchFilters: Filter[] = [];

    reviewsPage: Page<OCReviewDetails>;
    // review of the current user from the review list
    userReview: OCReviewDetails | Review;

    reviewsSorts: DropdownModel<string>[];
    selectedSort: DropdownModel<string>;
    reviewsFilter: DropdownModel<string>[] = [
        new DropdownModel('All Stars', null),
        new DropdownModel('5 Stars', `{'rating': 500}`),
        new DropdownModel('4 Stars', `{'rating': 400}`),
        new DropdownModel('3 Stars', `{'rating': 300}`),
        new DropdownModel('2 Stars', `{'rating': 200}`),
        new DropdownModel('1 Stars', `{'rating': 100}`),
    ];
    selectedFilter: DropdownModel<string> = this.reviewsFilter[0];
    isDeveloperPreviewPage: boolean = false;
    // switch between the review form and the review list
    isWritingReview: boolean = false;
    // flag for disabling a submit button and set a spinner while the request in process
    reviewSubmitInProgress: boolean = false;
    appListingActions: ActionButton[];
    // id of the current user. Necessary for a review
    currentUserId: string;
    // when true, the user can create a review without app ownership.
    allowReviewsWithoutOwnership: boolean = false;

    private destroy$: Subject<void> = new Subject();
    private appConfigPipe = pageConfig.fieldMappings;
    private loader: LoadingBarState;

    constructor(
        private appService: AppsService,
        private appVersionService: AppVersionService,
        private reviewsService: ReviewsService,
        private frontendService: FrontendService,
        private loadingBar: LoadingBarService,
        private route: ActivatedRoute,
        private router: Router,
        private titleService: TitleService,
        private statisticService: StatisticService,
        private metaTagService: MarketMetaTagService,
        private location: Location,
        private siteContentService: SiteContentService,
        private authHolderService: AuthHolderService,
        private buttonActionService: ButtonActionService,
    ) {}

    ngOnInit(): void {
        this.loader = this.loadingBar.useRef();
        this.initPageData();
        let currentId = this.route.snapshot.url[0].path;
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            const nextId = event.url.split('/')[2];
            if (currentId !== nextId) {
                this.loadAppPageData();
                currentId = nextId;
            }
        });
    }

    initAllowReviewsWithoutOwnershipProperty(): void {
        this.siteContentService
            .getSecuritySettings()
            .pipe(takeUntil(this.destroy$))
            .subscribe(settings => {
                // The user must be logged
                this.allowReviewsWithoutOwnership = this.authHolderService.isLoggedInUser() && settings?.allowReviewsWithoutOwnership;
            });
    }

    initReviewSortQueries(): void {
        this.frontendService
            .getSorts()
            .pipe(takeUntil(this.destroy$))
            .subscribe(page => {
                this.reviewsSorts = page.list[0]
                    ? page.list[0].values.map(value => new DropdownModel<string>(value.label, value.sort))
                    : null;
            });
    }

    initCurrentUserId(): void {
        this.currentUserId = this.authHolderService?.userDetails?.organizationId;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.loader.complete();
    }

    loadReviews(): void {
        this.loader.start();
        this.userReview = null;

        this.reviewsService
            .getReviewsByAppId(
                this.app.appId,
                this.selectedSort ? this.selectedSort.value : null,
                this.selectedFilter ? [this.selectedFilter.value] : [],
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                resPage => {
                    this.reviewsPage = resPage;

                    const someSortApplied = !!(this.selectedFilter.value || this.selectedSort);
                    if (this.currentUserId && !someSortApplied) {
                        this.makeCurrentUserReviewFirst();
                    }

                    if (this.overallRating.rating === 0) {
                        this.countRating();
                    }

                    this.loader.complete();
                },
                () => this.loader.complete(),
            );
    }

    onReviewSortChange(selected: DropdownModel<string>): void {
        this.selectedSort = selected;
        this.loadReviews();
    }

    onReviewFilterChange(selected: DropdownModel<string>): void {
        this.selectedFilter = selected;
        this.loadReviews();
    }

    getRecommendedApps(): void {
        this.loader.start();

        this.appService
            .getApps(1, 3, '{randomize: 1}', "{'status.value':'approved'}")
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                apps => {
                    this.recommendedApps = apps.list.map(app => new FullAppData(app, this.appConfigPipe));
                    this.loader.complete();
                },
                () => {
                    this.loader.complete();
                },
            );
    }

    closeWindow(): void {
        window.close();
    }

    getAppData(): void {
        this.loader.start();

        const appId = this.route.snapshot.paramMap.get('appId');
        const appVersion = this.route.snapshot.paramMap.get('appVersion');
        const safeName = this.route.snapshot.paramMap.get('safeName');

        this.appData$ = this.getApp(safeName, appId, appVersion);
        this.appData$
            .pipe(
                tap(x => {
                    this.loader.complete();
                    this.appListingActions = this.buttonActionService.canBeShow(this.app, actionButtons);
                    this.loadReviews();
                }),
                mergeMap(() => this.statisticService.recordVisitToApp(this.app.appId, new HttpHeaders({ 'x-handle-error': '400' }))),
            )
            .subscribe(
                () => {
                    // do nothing.
                },
                () => this.loader.complete(),
            );
    }

    onNewReview(): void {
        this.isWritingReview = true;
    }

    onReviewSubmit(review: Review): void {
        this.reviewSubmitInProgress = true;
        const reviewData = {
            ...review,
            appId: this.app.appId,
        };
        if (this.userReview) {
            this.reviewsService
                .updateReview({
                    ...reviewData,
                    reviewId: this.userReview.reviewId,
                })
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    () => this.reloadReview(),
                    () => (this.reviewSubmitInProgress = false),
                );
        } else {
            this.reviewsService
                .createReview(reviewData)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    () => this.reloadReview(),
                    () => (this.reviewSubmitInProgress = false),
                );
        }
    }

    onCancelReview(): void {
        this.isWritingReview = false;
    }

    onChosenReviewActon(option: ReviewListOptionType): void {
        switch (option) {
            case 'EDIT':
                this.editReview();
                return;
            case 'DELETE':
                this.deleteReview();
                return;
            default:
                return;
        }
    }

    goToSearchPageWithSelectedCategory(categoryLabel: string): void {
        for (const filter of this.searchFilters) {
            const selectedFilterValue = filter.values.find(filterValue => filterValue.label === categoryLabel);

            if (selectedFilterValue) {
                this.router.navigate(['browse', filter.id, selectedFilterValue.id]).then();
                return;
            }
        }
    }

    goBack(): void {
        this.location.back();
    }

    private initPageData(): void {
        this.initCurrentUserId();
        this.initAllowReviewsWithoutOwnershipProperty();
        this.initReviewSortQueries();
        this.getSearchFilters();
        this.loadAppPageData();
    }

    private loadAppPageData(): void {
        this.getAppData();
        this.getRecommendedApps();
    }

    private getSearchFilters(): void {
        this.frontendService
            .getFilters()
            .pipe(takeUntil(this.destroy$))
            .subscribe(data => {
                this.searchFilters = data.list;
            });
    }

    private makeCurrentUserReviewFirst(): void {
        const userReviewIndex = this.reviewsPage.list.findIndex(review => review.userId === this.currentUserId);
        if (userReviewIndex !== -1) {
            this.userReview = this.reviewsPage.list.splice(userReviewIndex, 1)[0];
            this.reviewsPage.list.unshift(this.userReview);
        }
    }

    private editReview(): void {
        this.reviewsService
            .getOneReview(this.userReview.reviewId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(review => {
                this.userReview = review as Review;
                this.isWritingReview = true;
            });
    }

    private getApp(safeName: string, appId: string, appVersion: string): Observable<FullAppData> {
        const appData = safeName
            ? this.appService.getAppBySafeName(safeName)
            : this.appVersionService.getAppByVersion(appId, Number(appVersion));

        return appData.pipe(
            takeUntil(this.destroy$),
            catchError(error => {
                if (error.status === 404) {
                    this.router.navigate(['/not-found']).then(() => this.loader.complete());
                }
                return of(error);
            }),
            tap(appResponse =>
                this.metaTagService.pushSelectedFieldsToTempPageData({
                    app: appResponse,
                }),
            ),
            map(app => {
                const mappedApp = new FullAppData(app, pageConfig.fieldMappings);
                if (typeof mappedApp.images[0] === 'string') {
                    mappedApp.images = (mappedApp.images as string[]).map(imageItem => {
                        return {
                            image: imageItem,
                        };
                    });
                }
                return mappedApp;
            }),
            tap(app => {
                this.titleService.setSpecialTitle(app.name);
                this.app = app;
                return this.app;
            }),
        );
    }

    private countRating(): void {
        const approvedReviews = this.reviewsPage.list.filter(review => review.status.value === 'approved');

        this.overallRating = new OverallRatingSummary(this.app.rating / 100, this.app.reviewCount);
        approvedReviews.forEach(review => this.overallRating[Math.floor(review.rating / 100)]++);
    }

    private reloadReview(): void {
        this.loadReviews();
        this.reviewSubmitInProgress = false;
        this.isWritingReview = false;
    }

    private deleteReview(): void {
        this.reviewsService
            .deleteReview(this.userReview.reviewId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.loadReviews());
    }
}
