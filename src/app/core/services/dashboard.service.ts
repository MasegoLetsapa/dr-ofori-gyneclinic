import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardResponse } from '../models/dashboard.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Service()
export class DashboardService {

    private readonly http = inject(HttpClient);

    /*     private readonly apiUrl =
            'https://letsapamasego-001-site1.ltempurl.com/api/admin/dashboard';
     */
    private readonly apiUrl =
        `${environment.apiUrl}/admin/dashboard`;


    getDashboard(): Observable<DashboardResponse> {

        return this.http.get<DashboardResponse>(
            this.apiUrl
        );

    }

}
