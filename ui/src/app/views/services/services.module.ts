import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ForgeModule} from "@tylertech/forge-angular";
import {ServicesComponent} from "./services.component";
import {DemoCardComponent} from "../../shared/components/demo-card/demo-card.component";
import {ServiceDetailsComponent} from "./service-details/service-details.component";
import {KeysComponent} from "./service-details/keys/keys.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {DialogDisplayKey} from "./service-details/keys/display-key-dialog/display-key-dialog.component";

@NgModule({
    declarations: [
        ServicesComponent,
        ServiceDetailsComponent,
        KeysComponent,
        DialogDisplayKey
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ForgeModule,
        DemoCardComponent,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatGridListModule
    ]
})
export class ServicesModule {
}