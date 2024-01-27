import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { ProfileComponent } from "./profile/profile.component";

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  {path: 'profile', component: ProfileComponent, canActivate: [ OktaAuthGuard ]},
  { path: 'callback', component: OktaCallbackComponent },
  { path: '**', redirectTo: '', canActivate: [ OktaAuthGuard ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }