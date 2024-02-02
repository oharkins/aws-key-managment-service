import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
    selector: 'dialog-display-key',
    templateUrl: 'display-key-dialog.component.html',
    styleUrls: ['display-key-dialog.component.scss'],
    imports: [
        MatDialogModule,
        MatButtonModule
    ],
    standalone: true
})
export class DialogDisplayKey {
    constructor(@Inject(MAT_DIALOG_DATA) public data: {key:string},
                public dialog: MatDialog,
                private clipboard: Clipboard,
                private snackBar: MatSnackBar) {}
     copyToClipboard(): void{
        this.clipboard.copy(this.data.key);
        this.snackBar.open('Copied to clipboard!', 'Dismiss', {duration: 2000});
    }
}