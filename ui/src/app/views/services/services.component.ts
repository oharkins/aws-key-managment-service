import { Component, OnInit } from '@angular/core';
import { ForgeModule, DialogService } from "@tylertech/forge-angular";
import { DemoCardComponent } from "../../shared/components/demo-card/demo-card.component";
import { IColumnConfiguration, SortDirection } from "@tylertech/forge";
import { BehaviorSubject, Observable } from "rxjs";
import { AsyncPipe, NgIf } from "@angular/common";
import { AdminService } from "../../core/services/admin.service";
import { Router } from "@angular/router";
import { ServiceAddComponent } from "../../service-add/service-add.component";


interface IService {
  [key: string]: any;
  Id: number;
  Name: string;
  Age: number;
  Position: string;
  FavoriteColor: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './services.component.html',
  standalone: true,
  imports: [
    ForgeModule,
    DemoCardComponent,
    AsyncPipe,
    NgIf
  ],
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit{

  public data$: Observable<any> | undefined;
  constructor(private adminService: AdminService, private router: Router, private _dialogService: DialogService) {
  }

  public async onRowClick(evt: CustomEvent): Promise<void> {
    console.log(evt.detail.data);
    await this.router.navigate(['services/', evt.detail.data.serviceId]);
  }

  public ngOnInit(): void {
    this.data$ = this.adminService.getServices()
  }
  public multiColumnSortConfigurations: IColumnConfiguration[] = [
    { header: 'Service Id', property: 'serviceId', sortable: true, initialSort: { sortOrder: 1, direction: SortDirection.Descending, propertyName: 'Name' } },
    { header: 'Name', property: 'name', sortable: true },
    { header: 'Status', property: 'status', sortable: true }
  ];

  public onAddService(): void {
    // Set any options to be applied to the <forge-dialog> component
    const dialogOptions = {
      backdropClose: false,
      escapeClose: true
    };

    // Show the dialog
    const dialogRef = this._dialogService.show(ServiceAddComponent, dialogOptions);

    // Subscribe to the afterClosed observable to know when the dialog is closed
    const sub = dialogRef.afterClosed.subscribe(result => {
      console.log('Dialog result:', result);
      sub.unsubscribe();
    });
  }
}
