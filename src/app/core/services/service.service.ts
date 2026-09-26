import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ClinicService, CreateServiceRequest, UpdateServiceRequest } from '../models/service.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ServiceService {
    private readonly http = inject(HttpClient);

    /* private readonly apiUrl =
        'https://letsapamasego-001-site1.ltempurl.com/api/services'; */

    private readonly apiUrl =
        `${environment.apiUrl}/services`;

    // Public services.
    // The API returns active services from GET /api/Services.
    getServices(): Observable<ClinicService[]> {

        return this.http.get<ClinicService[]>(
            this.apiUrl
        );

    }


    // Admin services.
    getAllServices(): Observable<ClinicService[]> {

        return this.http.get<ClinicService[]>(
            `${this.apiUrl}/all`
        );

    }


    getService(
        id: number
    ): Observable<ClinicService> {

        return this.http.get<ClinicService>(
            `${this.apiUrl}/${id}`
        );

    }


    createService(
        request: CreateServiceRequest
    ): Observable<ClinicService> {

        return this.http.post<ClinicService>(
            this.apiUrl,
            request
        );

    }


    updateService(
        id: number,
        request: UpdateServiceRequest
    ): Observable<ClinicService> {

        return this.http.put<ClinicService>(
            `${this.apiUrl}/${id}`,
            request
        );

    }


    archiveService(
        id: number
    ): Observable<void> {

        return this.http.put<void>(
            `${this.apiUrl}/${id}/archive`,
            {}
        );

    }


    restoreService(
        id: number
    ): Observable<void> {

        return this.http.put<void>(
            `${this.apiUrl}/${id}/restore`,
            {}
        );

    }
}
