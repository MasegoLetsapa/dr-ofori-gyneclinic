import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

import { PublicClinicSettings } from '../models/public-clinic-settings.model';

@Injectable({
    providedIn: 'root'
})
export class ClinicSettingsService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        'https://localhost:7003/api/settings/public';

    private readonly settings$ =
        this.http
            .get<PublicClinicSettings>(this.apiUrl)
            .pipe(
                shareReplay(1)
            );

    getSettings(): Observable<PublicClinicSettings> {
        return this.settings$;
    }
}