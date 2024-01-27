import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { platformApiUrl } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    constructor(private http: HttpClient) {}

    public getServices(): Observable<any>  {
        const url = `${platformApiUrl}/services`;
        return this.http.get<any>(url);
    }
}