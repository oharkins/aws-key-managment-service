import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { EVENT_ERROR, OktaAuth } from '@okta/okta-auth-js';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  private _sessionTimeoutSubscription?: Subscription;
  public isDrawerOpen = true;

  public user: any | undefined;
  public isAuthenticated: boolean | undefined = false;

  constructor(
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private authStateService: OktaAuthStateService
  ) {}

  public onMenuClicked(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
  ngOnInit() {
    this.configureAuthListeners();
  }

  public async logOut() {
    await this.oktaAuth.signOut();
  }
  private configureAuthListeners() {
    this.subscriptions.push(
      this.authStateService.authState$.subscribe(async authState => {
        this.user = await this.oktaAuth.getUser()

        console.log(`auth State: ${authState}`);
        this.isAuthenticated = authState.isAuthenticated;
      })
    );

    this.oktaAuth.tokenManager.on(EVENT_ERROR, async (err) => {
      await this.oktaAuth.signInWithRedirect();
    });
  }
}