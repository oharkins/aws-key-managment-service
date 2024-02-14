import { Location, NgForOf, NgTemplateOutlet, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IExpansionPanelComponent, IconRegistry } from '@tylertech/forge';
import { tylIconHome, tylIconSettings, tylIconSettingsInputComponent } from '@tylertech/tyler-icons/standard';
import { ForgeModule } from "@tylertech/forge-angular";

IconRegistry.define([
  tylIconHome,
  tylIconSettingsInputComponent,
  tylIconSettings
]);

export interface IMenuItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-sidenav',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [
    ForgeModule,
    NgTemplateOutlet,
    NgForOf,
    NgFor,
    NgIf
  ],
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent implements OnInit {

  public selectedPath!: string;

  @ViewChild('componentExpansionPanel', { static: false, read: ElementRef })
  public componentExpansionPanel!: ElementRef<IExpansionPanelComponent>;

  @ViewChild('exampleExpansionPanel', { static: false, read: ElementRef })
  public exampleExpansionPanel!: ElementRef<IExpansionPanelComponent>;

  @Input()
  public open: boolean;
  public drawerType!: string;
  public isSmallViewPort!: boolean;

  @Output() public onClose = new EventEmitter();

  @HostListener('window:resize')
  public onResize() {
    this.handleDrawer();
  }

  public componentMenuItems: IMenuItem[] = [
    { label: 'Services', value: '/component/accordion' }
  ];

  public exampleMenuItems: IMenuItem[] = [
    { label: 'User Settings', value: '/profile' },
  ];

  constructor(private _router: Router, private _location: Location, private _cd: ChangeDetectorRef) {
    this.open = window.innerWidth > 750;
  }

  public handleDrawer() {
    this.isSmallViewPort = window.innerWidth < 750;
  }

  public openSidenav() {
    this.open = true;
  }

  public closeSidenav() {
    this.open = false;
    this.onClose.emit();
  }

  public adjustDrawer() {
    this.drawerType = this.isSmallViewPort ? 'modal' : 'dismissible';
    this.open = !this.isSmallViewPort;
  }

  public ngOnInit(): void {
    this.handleDrawer();
    this.adjustDrawer();
  }

  public ngAfterViewInit(): void {
    const path = this._location.path() || '/';
    this.selectedPath = path;
    this._cd.detectChanges();

    // Automatically expand a menu item if the active menu item exists within it
    if (path.match(/^\/component\//)) {
      this.componentExpansionPanel.nativeElement.open = true;
    } else if (path.match(/^\/example\//)) {
      this.exampleExpansionPanel.nativeElement.open = true;
    }
  }

  public onMenuItemSelected(evt: CustomEvent): void {
    this.selectedPath = evt.detail.value;
    this._router.navigateByUrl(evt.detail.value);
  }
}
