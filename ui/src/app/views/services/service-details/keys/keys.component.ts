import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from "rxjs";
import {Subscription} from "rxjs/internal/Subscription";
import {AdminService} from "../../../../core/services/admin.service";
import {DialogService, IDialogOptions} from "@tylertech/forge-angular";
import {DialogDisplayKey} from "./display-key-dialog/display-key-dialog.component";

@Component({
    selector: 'app-keys',
    templateUrl: './keys.component.html',
    styleUrls: ['./keys.component.scss']
})
export class KeysComponent implements OnInit, OnChanges, OnDestroy {
    @Input() ServiceDetails?: any;

    key$: Observable<any> = new Observable<any>();
    showAddKey: boolean = true;
    private keySubscription: Subscription | undefined;

    constructor(
        private adminService: AdminService,
        private _dialogService: DialogService
    ) {
    }

    ngOnInit() {
        this.loadKeys();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.ServiceDetails) {
            this.loadKeys();
        }
    }

    ngOnDestroy() {
        // Unsubscribe to prevent memory leaks
        if (this.keySubscription) {
            this.keySubscription.unsubscribe();
        }
    }

    loadKeys() {
        this.key$ = this.adminService.getKeys(this.ServiceDetails.serviceId)
        this.keySubscription = this.key$.subscribe(keys => {
            keys.length == 0 ? this.showAddKey = true : this.showAddKey = false;
            console.log(this.showAddKey);
        });

    }
    onAddKey() {
        this.adminService.addKey(this.ServiceDetails.serviceId).subscribe({
            next: (AddKeyResponse: any) => {
                this.openKeyDialog(AddKeyResponse.key);
                // this.snackBar.open(`Added successfully`, 'X', {
                //     duration: 3000,
                //     panelClass: ['success-snack-bar']
                // });
                console.log(AddKeyResponse);
            },
            error: (err) => {
                console.log(err);
                // this.snackBar.open('An error occurred while adding the service.', 'X', {
                //     duration: 3000,
                //     panelClass: ['error-snack-bar']
                // });
            }
        });
    }

    openKeyDialog(key: string): void {
        // Set any options to be applied to the <forge-dialog> component
        const dialogOptions: IDialogOptions = {
            backdropClose: false,
            escapeClose: true
        };
        const dialogConfig = {
            data: {key: key}
        };
        // Show the dialog
        const dialogRef = this._dialogService.show(DialogDisplayKey, dialogOptions, dialogConfig);

        // Subscribe to the afterClosed observable to know when the dialog is closed
        const sub = dialogRef.afterClosed.subscribe(result => {
            console.log('Dialog result:', result);
            this.loadKeys();
            sub.unsubscribe();
        });
    }

    onRotateOrDeleteKey(doWhat: number, keyId: string) {
        if (doWhat == 0) {
            this.adminService.rotateKey(this.ServiceDetails.serviceId, keyId).subscribe({
                next: (AddKeyResponse: any) => {
                    this.openKeyDialog(AddKeyResponse.key);
                    // this.snackBar.open(`Added successfully`, 'X', {
                    //     duration: 3000,
                    //     panelClass: ['success-snack-bar']
                    // });
                    console.log(AddKeyResponse);
                    this.loadKeys();
                },
                error: (err) => {
                    console.log(err);
                    // this.snackBar.open('An error occurred while adding the service.', 'X', {
                    //     duration: 3000,
                    //     panelClass: ['error-snack-bar']
                    // });
                }
            });
        } else {
            this.adminService.deleteKey(this.ServiceDetails.serviceId, keyId).subscribe({
                next: (AddKeyResponse: any) => {
                    // this.snackBar.open(`Key Deleted`, 'X', {
                    //     duration: 3000,
                    //     panelClass: ['success-snack-bar']
                    // });
                    console.log(AddKeyResponse);
                    this.loadKeys();
                },
                error: (err) => {
                    console.log(err);
                    // this.snackBar.open('An error occurred while adding the service.', 'X', {
                    //     duration: 3000,
                    //     panelClass: ['error-snack-bar']
                    // });
                }
            });
        }
    }
}
