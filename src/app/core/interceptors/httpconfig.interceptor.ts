import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthHolderService } from '@mbd-common-libs/angular-common-services';
import { environment } from 'environments/environment';

export class HttpConfigInterceptor implements HttpInterceptor {
    
    constructor(private authHolderService: AuthHolderService, private apiURL: string) {}

    static addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,

            },
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // request = request.clone({
        //     setHeaders: {
        //         'X-Site-Key': environment.siteKey,
        //     }
        // });
        
        if (this.authHolderService.accessToken && request.url.startsWith(this.apiURL)) {
            request = HttpConfigInterceptor.addToken(request, this.authHolderService.accessToken);
        }

        return next.handle(request);
    }
}
