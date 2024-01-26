import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { LoaderModule } from '@tylertech/cj-jpp-ui-core';

import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    LoaderModule,
    RouterModule
  ]
})
export class ToolbarComponent implements OnInit, OnChanges  {

  @Input() themeIcon: string = ''; //material icon: https://fonts.google.com/icons
  @Input() user: any = {};
  @Input() applicationName: string = '';
  @Input() showMenuIcon: boolean = false;

  @Output() logoutClicked = new EventEmitter();
  @Output() themeClicked = new EventEmitter();
  @Output() menuClicked = new EventEmitter();
  @Output() profileClicked = new EventEmitter();

  public readonly baseURI: string;
  public readonly appHomeUrl: string = Location.stripTrailingSlash(environment.appHomeUrl || '');
  public readonly productHomeUrl: string;
  public readonly productHomeIsExternalUrl: boolean;

  public initials: string = '';
  public title: string = 'Tyler Technologies';

  constructor(private titleService: Title) {
    this.baseURI = Location.stripTrailingSlash(document.baseURI);
    this.productHomeUrl = this.baseURI === Location.stripTrailingSlash(environment.productHomeUrl || '') ? '/' : environment.productHomeUrl;
    this.productHomeIsExternalUrl = /^http/.test(this.productHomeUrl?.toLowerCase());
  }

  ngOnInit() {
    this.title = this.titleService.getTitle();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user) {
      this.user  = changes.user.currentValue;
      if (this.user?.given_name?.[0])
        this.initials += this.user?.given_name?.[0];

      if (this.user?.family_name?.[0])
        this.initials += this.user?.family_name?.[0];
    }

    if (changes.themeIcon)
      this.themeIcon = changes.themeIcon.currentValue
  }

  public onLogoutClicked() {
    this.logoutClicked.emit();
  }

  public onThemeClicked() {
    this.themeClicked.emit()
  }

  public onMenuClicked() {
    this.menuClicked.emit();
  }

  public onProfileClicked() {
    this.profileClicked.emit();
  }
}