import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from "@angular/common";
import { AdminService } from "../core/services/admin.service";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Observable } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ServiceAddComponent } from "../service-add/service-add.component";
import { MatDialog } from "@angular/material/dialog";
import { KeyAddComponent } from "../key-add/key-add.component";

@Component({
    selector: 'service-detail',
    standalone: true,
    imports: [
        AsyncPipe,
        MatProgressBarModule,
        NgIf,
        NgForOf,
        DatePipe,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './service-details.component.html',
    styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailComponent implements OnInit, OnChanges{
    constructor(
        private adminService: AdminService,
        private dialog: MatDialog
    ) {
    }
    @Input() selectedService?: any;
    keys: Observable<any> = new Observable<any>();
    ngOnInit() {
        this.selectedService.details = this.adminService.getService(this.selectedService.serviceId)
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.selectedService) {
            this.selectedService.details = this.adminService.getService(this.selectedService.serviceId)
            this.keys = this.adminService.getKeys(this.selectedService.serviceId)
        }
    }
    onAddKey() {
        this.dialog.open(KeyAddComponent, {
            panelClass: 'dialog-panel',
            data: { serviceId: this.selectedService.serviceId }
        });
    }

}
