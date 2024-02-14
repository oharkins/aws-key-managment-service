import { Component, OnInit } from '@angular/core';
import { DialogService, IDialogOptions } from "@tylertech/forge-angular";
import { IColumnConfiguration, SortDirection } from "@tylertech/forge";
import { Observable } from "rxjs";
import { AdminService } from "../../core/services/admin.service";
import { Router } from "@angular/router";
import { AddServiceComponent } from "./add-service/add-service.component";

@Component({
  selector: 'app-home',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit{

  public data$: Observable<any> | undefined;

  public multiColumnSortConfigurations: IColumnConfiguration[] = [
    { header: 'Service Id', property: 'serviceId', sortable: true, initialSort: { sortOrder: 1, direction: SortDirection.Descending, propertyName: 'Name' } },
    { header: 'Name', property: 'name', sortable: true },
    { header: 'Status', property: 'status', sortable: true }
  ];

  constructor(
      private adminService: AdminService,
      private router: Router,
      private _dialogService: DialogService) {
  }

  public async onRowClick(evt: CustomEvent): Promise<void> {
    console.log(evt.detail.data);
    await this.router.navigate(['services/', evt.detail.data.serviceId]);
  }

  public ngOnInit(): void {
    this.loadData();
  }
  public loadData(): void {
    this.data$ = this.adminService.getServices();
  }

  public onAddService(): void {
    // Set any options to be applied to the <forge-dialog> component
    const dialogOptions: IDialogOptions = {
      backdropClose: false,
      escapeClose: true
    };

    // Show the dialog
    const dialogRef = this._dialogService.show(AddServiceComponent, dialogOptions);

    // Subscribe to the afterClosed observable to know when the dialog is closed
    const sub = dialogRef.afterClosed.subscribe(result => {
      console.log('Dialog result:', result);
        this.loadData();
      sub.unsubscribe();
    });
  }
}
