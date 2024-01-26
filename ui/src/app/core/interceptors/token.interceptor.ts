import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@tylertech/cj-jpp-ui-core/authentication';
import { InstanceManagerService } from '@tylertech/cj-jpp-ui-core';

@Injectable({ providedIn: 'root' })
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService, private instanceManagerService: InstanceManagerService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.instanceManagerService.instanceTokenSnapshot || this.authService.getAccessToken();

    return next.handle(
      request.clone(
        {
          setHeaders: {
            Authorization: `Bearer ${token}`,
            Role: 'template'
          }
        }
      )
    );
  }
}