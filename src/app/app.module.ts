import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CustomHttpClientXsrfModule, OcCommonServiceModule} from 'oc-ng-common-service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {OAuthModule} from 'angular-oauth2-oidc';
import {ToastrModule} from 'ngx-toastr';
import {HttpConfigInterceptor} from '@core/interceptors/httpconfig.interceptor';
import {LoaderComponent} from '@shared/components/loader/loader.component';
import {environment} from '@env';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    OcCommonServiceModule.forRoot(environment),
    DragDropModule,
    ToastrModule.forRoot(),
    OAuthModule.forRoot(),
    CustomHttpClientXsrfModule.withOptions({headerName: 'X-CSRF-TOKEN', apiUrl: environment.apiUrl}),
    SharedModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    LoaderComponent,
  ],
})
export class AppModule {

}
