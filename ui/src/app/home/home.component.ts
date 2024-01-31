import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from "../core/services/admin.service";

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public services: any[] = [];
    displayedColumns: string[] = ['serviceId','name','status'];
    public selectedRow: any = undefined;

    constructor(
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private adminService: AdminService
    ) {
    }

    ngOnInit(): void {
        this.loadServices();
    }

    loadServices()
    {
        this.adminService.getServices().subscribe({
            next: (servicesResponse: any) => {
                this.services = servicesResponse.services;
            },
            error: () => {
                this.snackBar.open('An error occurred while loading the search results.', 'X', { duration: 3000, panelClass: ['error-snack-bar'] });
            }
        });
    }

    selectRow(row: any) {
        console.log(row);
        this.selectedRow = row;
    }
}