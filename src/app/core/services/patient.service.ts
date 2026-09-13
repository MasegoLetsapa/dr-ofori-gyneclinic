import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePatientRequest, Patient, UpdatePatientRequest } from '../models/patient.model';

@Service()
export class PatientService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        'https://localhost:7003/api/admin/patients';

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

    deletePatient(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}
