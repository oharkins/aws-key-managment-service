import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { environment } from 'src/environments/environment';
import { httpInterceptorProviders } from './core/interceptors/interceptor.barrel';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ForgeModule } from "@tylertech/forge-angular";
import { HeaderComponent } from "./components/header/header.component";
import { ServicesModule } from "./views/services/services.module";
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
        ServicesModule,
        ForgeModule,
        HeaderComponent,
        MatSnackBarModule
    ],
  providers: [
    httpInterceptorProviders,
    { provide: OKTA_CONFIG, useValue: { oktaAuth: new OktaAuth(environment.oidc) } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }