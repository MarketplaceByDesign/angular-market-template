import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, SiteConfigService } from '@mbd-common-libs/angular-common-services';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { siteConfig } from '../assets/data/siteConfig';
import { CmsContentService } from '@core/services/cms-content-service/cms-content-service.service';
import { LogOutService } from '@core/services/logout-service/log-out.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject();
    private loader: LoadingBarState;

    constructor(
        public router: Router,
        private authenticationService: AuthenticationService,
        private siteService: SiteConfigService,
        public loadingBar: LoadingBarService,
        private cmsService: CmsContentService,
        private logOutService: LogOutService,
    ) {
        this.loader = this.loadingBar.useRef();
    }

    ngOnInit(): void {
        // Clear user authorization, when in the URL params present specific key for SAML 2.0
        this.logOutService.removeSpecificParamKeyFromTheUrlForSaml2Logout();

        this.initSiteConfig();

        // refresh JWT token if exists`
        this.loader.start();
        this.authenticationService
            .tryLoginByRefreshToken()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                () => this.loader.stop(),
                () => this.loader.stop(),
            );

        // init csrf
        this.authenticationService.initCsrf().pipe(takeUntil(this.destroy$), first()).subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.loader.complete();
    }

    private initSiteConfig(): void {
        this.cmsService
            .getContentByPaths({
                siteTitle: 'site.title',
                siteFaviconHref: 'site.favicon',
            })
            .subscribe(content => {
                const config = { ...siteConfig };
                config.title = content.siteTitle as string;
                config.favicon.href = content.siteFaviconHref as string;
                this.siteService.initSiteConfiguration(config);
            });
    }
}
