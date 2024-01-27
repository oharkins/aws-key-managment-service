import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { EVENT_ERROR, OktaAuth } from '@okta/okta-auth-js';
import { LIGHT_THEME, Theme, ThemeService } from '@tylertech/cj-jpp-ui-core/theme';
import { SessionTimeoutService, SessionTimeoutStatus } from '@tylertech/cj-jpp-ui-core/session-timeout';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostBinding('class') private hostCssClass: string = '';
  private subscriptions: Subscription[] = [];
  private _sessionTimeoutSubscription?: Subscription;

  public readonly applicationName = 'Template';
  public themeIcon = '';
  public user: any | undefined;
  public isAuthenticated: boolean | undefined = false;

  constructor(
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private authStateService: OktaAuthStateService,
    private themeService: ThemeService,
    private sessionTimeoutService: SessionTimeoutService
  ) {}

  ngOnInit() {
    this.configureThemeListener();
    this.configureAuthListeners();
  }

  public async logOut() {
    await this.oktaAuth.signOut();
  }

  public toggleTheme() {
    this.themeService.toggleTheme();
  }

  private configureThemeListener() {
    this.subscriptions.push(
      this.themeService.theme.subscribe((theme: Theme) => {
        if (theme === LIGHT_THEME) {
          this.themeIcon = 'brightness_3';
        } else {
          this.themeIcon = 'wb_sunny';
        }
      })
    );
  }

  private configureAuthListeners() {
    this.subscriptions.push(
      this.authStateService.authState$.subscribe(async authState => {
        this.user = await this.oktaAuth.getUser()

        console.log(`auth State: ${authState}`);
        this.isAuthenticated = authState.isAuthenticated;

        this.toggleSessionTimeout();
      })
    );

    this.oktaAuth.tokenManager.on(EVENT_ERROR, async (err) => {
      await this.oktaAuth.signInWithRedirect();
    });
  }

  private toggleSessionTimeout() {
    if (this.isAuthenticated) {
      this._sessionTimeoutSubscription?.unsubscribe();

      this._sessionTimeoutSubscription = this.sessionTimeoutService.sessionTimeout$.subscribe(async status => {
        if (status === SessionTimeoutStatus.COMPLETE) {
          await this.oktaAuth.signOut();
        }
      });

      this.sessionTimeoutService.startSessionMonitor();
    } else {
      this._sessionTimeoutSubscription?.unsubscribe();
      this.sessionTimeoutService.reset();
    }
  }
}