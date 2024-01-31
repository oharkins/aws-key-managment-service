import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HomeRoutingModule } from './home-routing.module';
import { MatInputModule } from '@angular/material/input';
import { HomeComponent } from './home.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from "@angular/material/slider";
import { MatTableModule } from "@angular/material/table";
import { ServiceDetailComponent } from "../service-details/service-details.component";

@NgModule({
    declarations: [
        HomeComponent

    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatProgressBarModule,
        MatSliderModule,
        MatTableModule,
        ServiceDetailComponent
    ]
})
export class HomeModule { }