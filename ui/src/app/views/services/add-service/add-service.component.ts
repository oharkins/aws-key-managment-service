import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from "../../../core/services/admin.service";
import { DialogRef, ForgeModule } from "@tylertech/forge-angular";
import { NgIf } from "@angular/common";

interface addServiceForm {
    serviceDescription: FormControl<string>;
    email: FormControl<string>;
    maxAge: FormControl<number>;
}
@Component({
    selector: 'app-add-service',
    templateUrl: './add-service.component.html',
    standalone: true,
    imports: [
        ForgeModule,
        ReactiveFormsModule,
        NgIf
    ],
    styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent {

    public addServiceForm: FormGroup<addServiceForm>;
    public maxAgeControl: FormControl<number>;
    constructor(
        private _dialogRef: DialogRef,
        private adminService: AdminService
    ) {
        this.addServiceForm = new FormGroup<addServiceForm>({
            serviceDescription: new FormControl('', { nonNullable: true, validators: Validators.required}),
            email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
            maxAge: new FormControl(14, { nonNullable: true, validators: Validators.min(14) }),
        });
        this.maxAgeControl = this.addServiceForm.controls.maxAge;
    }
    public isInvalid(name: string): boolean {
        const control = this.addServiceForm.get(name);
        return !!control && control.touched && control.invalid;
    }
    public onSubmit(): void {
        console.log(this.addServiceForm.value);
        if (this.addServiceForm.valid) {
            const emails = this.addServiceForm.value.email?.split(',');
            this.adminService.addService(this.addServiceForm.value.serviceDescription || "FAIL", this.addServiceForm.value.maxAge || 180, emails || [] ).subscribe({
                next: () => {
                    this._dialogRef.close();
                },
                error: (err) => {
                    console.log(err);
                }
            });
        }
    }
    public onCancel(): void {
        this._dialogRef.close(false);
    }
}