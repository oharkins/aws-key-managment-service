import {Component} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import {DialogConfig, DialogRef} from "@tylertech/forge-angular";

@Component({
    selector: 'dialog-display-key',
    templateUrl: 'display-key-dialog.component.html',
    styleUrls: ['display-key-dialog.component.scss'],
})
export class DialogDisplayKey {
    constructor(
                private clipboard: Clipboard,
                private _dialogRef: DialogRef,
                public dialogConfig: DialogConfig) {}

    copyToClipboard(): void {
        this.clipboard.copy(this.dialogConfig.data.key);
    }
    public onCancel(): void {
        this._dialogRef.close(false);
    }
}