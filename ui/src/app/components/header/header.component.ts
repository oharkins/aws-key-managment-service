import { Component, Output, EventEmitter, SimpleChanges, Input, Inject } from '@angular/core';
import { ForgeModule, ToastService } from '@tylertech/forge-angular';
import { IAppBarSearchInputEventData, IconRegistry } from '@tylertech/forge';
import { toggleClass } from '@tylertech/forge-core';
import { tylIconTylerTalkingTLogo } from '@tylertech/tyler-icons/custom';
import { tylIconBrightness3 } from '@tylertech/tyler-icons/extended';
import { tylIconWbSunny } from '@tylertech/tyler-icons/standard';
import { OKTA_AUTH } from "@okta/okta-angular";
import { OktaAuth } from "@okta/okta-auth-js";
import { Observable } from "rxjs";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
    imports: [
        ForgeModule,
        NgOptimizedImage
    ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private _isDark = false;
  public themeSwitcherIcon: string = tylIconBrightness3.name;
  @Input() user: any = {};

  @Output() public logoutClicked = new EventEmitter<void>();

  @Output() public menuClicked = new EventEmitter<void>();

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth, private _toastService: ToastService) {
    IconRegistry.define([
      tylIconTylerTalkingTLogo,
      tylIconWbSunny,
      tylIconBrightness3
    ]);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.user) {
      this.user  = changes.user.currentValue;
    }
  }
  public onMenuClicked(): void {
    this.menuClicked.next();
  }
  public handleSignOutButtonCLick(): void {
    this.logoutClicked.next();
  }

  public onSearch(evt: CustomEvent<IAppBarSearchInputEventData>): void {
    this._toastService.show(`Search: ${evt.detail}`);
  }

  public toggleTheme() {
    this._isDark = !this._isDark;
    toggleClass(document.body, this._isDark, 'app-theme-dark');
    this.themeSwitcherIcon = this._isDark ? tylIconWbSunny.name : tylIconBrightness3.name;
  }
}
