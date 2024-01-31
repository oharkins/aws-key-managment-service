import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { AdminService } from "../core/services/admin.service";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Observable } from "rxjs";

@Component({
    selector: 'service-detail',
    standalone: true,
    imports: [
        AsyncPipe,
        MatProgressBarModule,
        NgIf,
        NgForOf
    ],
    templateUrl: './service-details.component.html',
    styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailComponent implements OnInit, OnChanges{
    constructor(
        private adminService: AdminService
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

}
