import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';

const routes: Routes = [
  { path: 'callback', component: OktaCallbackComponent },
  { path: '**', redirectTo: '', canActivate: [ OktaAuthGuard ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }