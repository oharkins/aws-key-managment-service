import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from "@angular/common";
import { AdminService } from "../core/services/admin.service";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Observable } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from "@angular/material/dialog";
import { KeyAddComponent } from "../key-add/key-add.component";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { ServiceAddComponent } from "../service-add/service-add.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'app-keys',
    standalone: true,
    imports: [
        AsyncPipe,
        MatProgressBarModule,
        NgIf,
        NgForOf,
        DatePipe,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatGridListModule
    ],
    templateUrl: './keys.component.html',
    styleUrls: ['./keys.component.scss']
})
export class KeysComponent implements OnChanges{
    constructor(
        private adminService: AdminService,
        private dialog: MatDialog,
        public snackBar: MatSnackBar
    ) {
    }
    @Input() ServiceDetails?: any;
    keys: Observable<any> = new Observable<any>();

    ngOnChanges(changes: SimpleChanges) {
        if (changes.ServiceDetails) {
            this.loadKeys();
        }
    }

    loadKeys()
    {
        this.keys = this.adminService.getKeys(this.ServiceDetails.serviceId)
    }
    onRotateOrDeleteKey(doWhat: number, keyId: string){
        if (doWhat == 0){
            this.adminService.rotateKey(this.ServiceDetails.serviceId,keyId).subscribe({
                next: (AddKeyResponse: any) => {
                    this.snackBar.open(`Added successfully`, 'X', {
                        duration: 3000,
                        panelClass: ['success-snack-bar']
                    });
                    console.log(AddKeyResponse);
                    this.loadKeys();
                },
                error: (err) => {
                    console.log(err);
                    this.snackBar.open('An error occurred while adding the service.', 'X', {
                        duration: 3000,
                        panelClass: ['error-snack-bar']
                    });
                }
            });
        }else{
            this.adminService.deleteKey(this.ServiceDetails.serviceId,keyId).subscribe({
                next: (AddKeyResponse: any) => {
                    this.snackBar.open(`Key Deleted`, 'X', {
                        duration: 3000,
                        panelClass: ['success-snack-bar']
                    });
                    console.log(AddKeyResponse);
                    this.loadKeys();
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
    onAddKey() {
        this.adminService.addKey(this.ServiceDetails.serviceId).subscribe({
            next: (AddKeyResponse: any) => {
                this.snackBar.open(`Added successfully`, 'X', {
                    duration: 3000,
                    panelClass: ['success-snack-bar']
                });
                console.log(AddKeyResponse);
                this.loadKeys();
            },
            error: (err) => {
                console.log(err);
                this.snackBar.open('An error occurred while adding the service.', 'X', {
                    duration: 3000,
                    panelClass: ['error-snack-bar']
                });
            }
        });


        // this.dialog.open(KeyAddComponent, {
        //     panelClass: 'dialog-panel',
        //     data: { serviceId: this.ServiceDetails.serviceId }
        // });
        // this.dialog.afterAllClosed.subscribe(result => {
        //     this.loadKeys()
        // });
    }

}
