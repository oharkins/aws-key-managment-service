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
    public getService(serviceId:string): Observable<any> {
        const url = `${platformApiUrl}/services/${serviceId}`;
        return this.http.get<any>(url);
    }
    public addService(name: string, maxKeyAgeDays: number, emails: string[]): Observable<any>  {
        const url = `${platformApiUrl}/services`;
        return this.http.post<any>(url,
            {
                name: name,
                maxKeyAgeDays: maxKeyAgeDays,
                emails: emails
            });
    }
    public addKey(serviceId: string, name: string): Observable<any>  {
        const url = `${platformApiUrl}/services/${serviceId}/key`;
        return this.http.post<any>(url,
            {
                name: name,
            });
    }
    public getKeys(serviceId:string): Observable<any>  {
        const url = `${platformApiUrl}/services/${serviceId}/keys`;
        return this.http.get<any>(url);
    }
    public getKey(serviceId:string, keyId: string): Observable<any>  {
        const url = `${platformApiUrl}/services/${serviceId}/keys${keyId}`;
        return this.http.get<any>(url);
    }
}