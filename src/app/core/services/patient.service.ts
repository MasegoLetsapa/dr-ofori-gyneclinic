import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePatientRequest, Patient, PatientProfile, UpdatePatientRequest } from '../models/patient.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private readonly http = inject(HttpClient);

    /* private readonly apiUrl =
        'https://letsapamasego-001-site1.ltempurl.com/api/admin/patients';
 */
    private readonly apiUrl =
        `${environment.apiUrl}/admin/patients`;

    getPatients(): Observable<Patient[]> {
        return this.http.get<Patient[]>(this.apiUrl);
    }

    getPatient(id: number): Observable<Patient> {
        return this.http.get<Patient>(
            `${this.apiUrl}/${id}`
        );
    }

    createPatient(
        request: CreatePatientRequest
    ): Observable<Patient> {
        return this.http.post<Patient>(
            this.apiUrl,
            request
        );
    }

    updatePatient(
        id: number,
        request: UpdatePatientRequest
    ): Observable<Patient> {
        return this.http.put<Patient>(
            `${this.apiUrl}/${id}`,
            request
        );
    }

    archivePatient(id: number): Observable<void> {
        return this.http.put<void>(
            `${this.apiUrl}/${id}/archive`,
            {}
        );
    }

    restorePatient(id: number): Observable<void> {
        return this.http.put<void>(
            `${this.apiUrl}/${id}/restore`,
            {}
        );
    }

    getPatientProfile(id: number): Observable<PatientProfile> {
        return this.http.get<PatientProfile>(
            `${this.apiUrl}/${id}/profile`
        );
    }
}
