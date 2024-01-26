import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { EVENT_ERROR, OktaAuth } from '@okta/okta-auth-js';
import { AuthenticationService } from '@tylertech/cj-jpp-ui-core/authentication';
import { LIGHT_THEME, Theme, ThemeService } from '@tylertech/cj-jpp-ui-core/theme';
import { SessionTimeoutService, SessionTimeoutStatus } from '@tylertech/cj-jpp-ui-core/session-timeout';
import { InstanceManagerService } from '@tylertech/cj-jpp-ui-core/instance-manager';
import { Subscription } from 'rxjs/internal/Subscription';

import { UserService } from './core/services/user.service';

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
    private authService: AuthenticationService,
    private instanceManagerService: InstanceManagerService,
    private userService: UserService,
    private sessionTimeoutService: SessionTimeoutService
  ) {}

  ngOnInit() {
    this.configureThemeListener();
    this.configureAuthListeners();
  }

  public async logOut() {
    await this.authService.logOut();
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
        if (authState.isAuthenticated) {
          await Promise.allSettled([
            (async () => this.user = await this.userService.getUser())()

            // The below line should be uncommented out if/when this app is hooked up to the data boundary and user service
            // this.instanceManagerService.initWithActiveInstance()
          ]);
        }

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
          await this.authService.logOut();
        }
      });

      this.sessionTimeoutService.startSessionMonitor();
    } else {
      this._sessionTimeoutSubscription?.unsubscribe();
      this.sessionTimeoutService.reset();
    }
  }
}