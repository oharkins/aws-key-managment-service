import { Injectable } from '@angular/core';
import { AuthenticationService } from '@tylertech/cj-jpp-ui-core/authentication';
import { firstValueFrom, from, Observable, share } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user$!: Observable<any>;
  private fetchUserFailure = false;

  constructor(private authService: AuthenticationService) {}

  public async getUser(): Promise<any> {
    if (this.fetchUserFailure || !this.user$) {
      this.user$ = from(this._getUser()).pipe(share());
    }

    return firstValueFrom(this.user$);
  }

  private async _getUser() {
    try {
      this.fetchUserFailure = false;

      return this.authService.getUser();
    } catch(e) {
      this.fetchUserFailure = true;
      console.error(`Error fetching user`, e);
    }
  }
}