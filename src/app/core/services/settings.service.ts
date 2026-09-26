import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    ClinicSettings,
    SettingsResponse,
    UpdateClinicSettingsRequest
} from '../models/settings.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private readonly http = inject(HttpClient);

    /* private readonly apiUrl =
        'https://letsapamasego-001-site1.ltempurl.com/api/settings';
 */
    private readonly apiUrl =
        `${environment.apiUrl}/settings`;


    getSettings(): Observable<ClinicSettings> {
        return this.http.get<ClinicSettings>(this.apiUrl);
    }

    updateSettings(
        request: UpdateClinicSettingsRequest
    ): Observable<SettingsResponse> {

        return this.http.put<SettingsResponse>(
            this.apiUrl,
            request
        );
    }
}