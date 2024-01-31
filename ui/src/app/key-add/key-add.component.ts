import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from "@angular/material/snack-bar";
import { AdminService } from "../core/services/admin.service";

@Component({
    selector: 'key-add',
    templateUrl: './key-add.component.html',
    styleUrls: ['./key-add.component.scss']
})
export class KeyAddComponent {

    constructor(
        public dialogRef: MatDialogRef<KeyAddComponent>,
        private fb: FormBuilder,
        public snackBar: MatSnackBar,
        private adminService: AdminService
    ) { }
    @Input() serviceId?: string;
    public form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(1)]]
    });

    public onUpload() {
        console.log(this.form.value);
        if (this.form.valid) {
            this.adminService.addKey(this.serviceId || "null", this.form.value.name || "FAIL").subscribe({
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