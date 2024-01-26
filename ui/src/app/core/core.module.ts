import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationModule } from '@tylertech/cj-jpp-ui-core';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AuthenticationModule
  ]
})
export class CoreModule { }