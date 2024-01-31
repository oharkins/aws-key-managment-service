import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ServiceAddComponent } from './service-add.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from "@angular/material/select";

@NgModule({
    declarations: [
        ServiceAddComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        MatSelectModule
    ]
})
export class ServiceAddModule { }