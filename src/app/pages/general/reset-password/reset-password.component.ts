import { Component, OnDestroy } from '@angular/core';
import { NativeLoginService } from '@mbd-common-libs/angular-common-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComponentsUserResetPassword } from '@mbd-common-libs/angular-common-components';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnDestroy {
    companyLogoUrl = './assets/img/company-logo-2x.png';
    inProcess = false;
    resetModel = new ComponentsUserResetPassword();

    private destroy$: Subject<void> = new Subject();

    constructor(
        private nativeLoginService: NativeLoginService,
        private router: Router,
        private route: ActivatedRoute,
        private toaster: ToastrService,
    ) {
        this.resetModel.code = this.route.snapshot.queryParamMap.get('token');
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    reset(event: boolean): void {
        if (event === true && !this.inProcess) {
            this.inProcess = true;
            this.nativeLoginService
                .resetPassword(this.resetModel)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    res => {
                        this.toaster.success('Your password has reset successfully.');
                        this.inProcess = false;
                        this.router.navigate(['login']).then();
                    },
                    error => {
                        this.inProcess = false;
                    },
                );
        }
    }
}
