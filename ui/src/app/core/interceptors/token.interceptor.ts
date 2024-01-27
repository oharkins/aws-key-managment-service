import { Inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OktaAuth } from "@okta/okta-auth-js";
import { OKTA_AUTH } from "@okta/okta-angular";

@Injectable({ providedIn: 'root' })
export class TokenInterceptor implements HttpInterceptor {
  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.oktaAuth.getAccessToken();

    return next.handle(
      request.clone(
        {
          setHeaders: {
            Authorization: `Bearer ${token}`,
            InstanceId: 'user'
          }
        }
      )
    );
  }
}