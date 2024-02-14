import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgeModule } from "@tylertech/forge-angular";
import { ServicesComponent } from "./services.component";
import { DemoCardComponent } from "../../shared/components/demo-card/demo-card.component";
@NgModule({
    declarations: [
        ServicesComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ForgeModule,
        DemoCardComponent
    ]
})
export class ServicesModule { }