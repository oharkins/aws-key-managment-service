import { Component, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from "@angular/material/snack-bar";
import { AdminService } from "../core/services/admin.service";

@Component({
    selector: 'service-add',
    templateUrl: './service-add.component.html',
    styleUrls: ['./service-add.component.scss']
})
export class ServiceAddComponent {

    constructor(
        public dialogRef: MatDialogRef<ServiceAddComponent>,
        private fb: FormBuilder,
        public snackBar: MatSnackBar,
        private adminService: AdminService
    ) { }

    public form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(1)]],
        maxKeyAgeDays: [0, [Validators.required, Validators.minLength(1)]],
        email: ['', [Validators.required, Validators.email]],
        //emails: this.fb.array([]),
    });

    // get emails() {
    //     return this.form.controls["emails"] as FormArray;
    // }
    // addEmail() {
    //     const lessonForm = this.fb.group({
    //         email: ['', Validators.required,Validators.email],
    //     });
    //     this.emails.push(lessonForm);
    // }
    // deleteEmail(lessonIndex: number) {
    //     this.emails.removeAt(lessonIndex);
    // }

    public onUpload() {
        console.log(this.form.value);
        if (this.form.valid) {
            const emails = this.form.value.email?.split(',');
            this.adminService.addService(this.form.value.name || "FAIL", this.form.value.maxKeyAgeDays || 100000, emails || [] ).subscribe({
                next: () => {
                    this.dialogRef.close();
                    this.snackBar.open(`${this.form.value.name} added successfully`, 'X', {
                        duration: 3000,
                        panelClass: ['success-snack-bar']
                    });
                },
                error: (err) => {
                    console.log(err);
                    this.snackBar.open('An error occurred while adding the service.', 'X', {
                        duration: 3000,
                        panelClass: ['error-snack-bar']
                    });
                }
            });
        }
    }
}