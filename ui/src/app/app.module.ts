import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { environment, productKey } from 'src/environments/environment';
import { httpInterceptorProviders } from './core/interceptors/interceptor.barrel';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ServiceAddModule } from "./service-add/service-add.module";
import { KeyAddModule } from "./key-add/key-add.module";
import { ForgeModule } from "@tylertech/forge-angular";
import { HeaderComponent } from "./components/header/header.component";
import { SidenavComponent } from "./components/sidenav/sidenav.component";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        HttpClientModule,
        OktaAuthModule,
        MatButtonModule,
        MatIconModule,
        ServiceAddModule,
        KeyAddModule,
        ForgeModule,
        HeaderComponent,
        SidenavComponent
    ],
  providers: [
    httpInterceptorProviders,
    { provide: OKTA_CONFIG, useValue: { oktaAuth: new OktaAuth(environment.oidc) } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }