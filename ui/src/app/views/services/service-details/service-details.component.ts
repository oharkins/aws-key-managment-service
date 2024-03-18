import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subscription } from "rxjs/internal/Subscription";
import { ActivatedRoute } from "@angular/router";
import { AdminService } from "../../../core/services/admin.service";
import {KeysComponent} from "./keys/keys.component";

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss']
})

export class ServiceDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(KeysComponent) keysComponent?: KeysComponent;

  private subscriptions: Subscription[] = [];
  public serviceId: string = '';
  public service: any = {};

  constructor(private route: ActivatedRoute,
              private adminService: AdminService) {
  }
  ngOnInit() {
    this.subscriptions.push(
        this.route.paramMap.subscribe(params => {
          this.serviceId = <string>params.get('id');
          this.adminService.getService(this.serviceId).subscribe({
            next: (servicesResponse: any) => {
              console.log(servicesResponse);
              this.service = servicesResponse;
            },
            error: (err) => {
              console.log(err);
            }
          });
        })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}