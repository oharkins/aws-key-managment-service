import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ForgeModule } from "@tylertech/forge-angular";
import { HeaderComponent } from "./components/header/header.component";
import { SidenavComponent } from "./components/sidenav/sidenav.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ForgeModule, HeaderComponent, SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'kms';
  public isDrawerOpen = true;

  public onMenuClicked(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
