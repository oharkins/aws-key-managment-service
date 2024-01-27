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
        this.adminService.getServices().subscribe(
            (data: any) => {
                this.services = data;
            },
            (error: any) => {
                this.snackBar.open(error.message, 'Close');
            }
        );
    }
}