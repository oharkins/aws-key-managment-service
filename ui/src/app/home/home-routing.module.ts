import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard } from '@okta/okta-angular';
import { HomeComponent } from './home.component';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [ OktaAuthGuard ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }