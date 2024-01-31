import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ThemeModule, THEME_STORAGE_KEY } from '@tylertech/cj-jpp-ui-core/theme';
import { AuthenticationModule, DOMAIN_USER_ENDPOINT } from '@tylertech/cj-jpp-ui-core/authentication';
import { removeTrailingSlashes } from '@tylertech/cj-jpp-ui-core/utils';
import { SESSION_TIMEOUT_CONFIG, SessionTimeoutModule } from '@tylertech/cj-jpp-ui-core/session-timeout';
import { DOMAIN_INSTANCE_ENDPOINT } from '@tylertech/cj-jpp-ui-core/instance-manager';
import { environment, productKey } from 'src/environments/environment';
import { httpInterceptorProviders } from './core/interceptors/interceptor.barrel';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ServiceAddModule } from "./service-add/service-add.module";
import { KeyAddModule } from "./key-add/key-add.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    AuthenticationModule,
    BrowserModule,
    HttpClientModule,
    OktaAuthModule,
    SessionTimeoutModule,
    ThemeModule,
    ToolbarComponent,
    MatButtonModule,
    MatIconModule,
    ServiceAddModule,
    KeyAddModule
  ],
  providers: [
    httpInterceptorProviders,
    { provide: THEME_STORAGE_KEY, useValue: `${productKey}#theme` },
    { provide: OKTA_CONFIG, useValue: { oktaAuth: new OktaAuth(environment.oidc) } },
    { provide: SESSION_TIMEOUT_CONFIG, useValue: environment.sessionTimeoutSettings },
    { provide: DOMAIN_USER_ENDPOINT, useValue: `${removeTrailingSlashes(environment.userApiUrl)}/internal/userinfo` },
    { provide: DOMAIN_INSTANCE_ENDPOINT, useValue: `${removeTrailingSlashes(environment.userApiUrl)}/instances` }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }