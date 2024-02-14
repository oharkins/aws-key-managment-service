import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { ProfileComponent } from "./profile/profile.component";
import { ServicesComponent } from "./views/services/services.component";
import { ServiceDetailsComponent } from "./views/service-details/service-details.component";

const routes: Routes = [
  { path: '', redirectTo: '/services', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent, canActivate: [ OktaAuthGuard ]},
  { path: 'services', component: ServicesComponent, canActivate: [ OktaAuthGuard ]},
  { path: 'services/:id', component: ServiceDetailsComponent, canActivate: [ OktaAuthGuard ]},
  { path: 'callback', component: OktaCallbackComponent },
  { path: '**', redirectTo: '', canActivate: [ OktaAuthGuard ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }