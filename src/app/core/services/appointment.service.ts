import { inject, Service } from '@angular/core';
import { Appointment, AppointmentResponse, CommunicationLog, CreateAppointmentRequest } from '../models/appointment.model';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Service()
export class AppointmentService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        'https://letsapamasego-001-site1.ltempurl.com/api/appointments';


    createAppointment(
        request: CreateAppointmentRequest
    ): Observable<AppointmentResponse> {

        return this.http
            .post<AppointmentResponse>(
                this.apiUrl,
                request
            )
            .pipe(
                catchError(error => {

                    console.error(
                        'Appointment request failed:',
                        error
                    );

                    return throwError(
                        () => error
                    );

                })
            );
    }

    // ========================================
    // GET ALL APPOINTMENTS
    // ========================================

    getAppointments(): Observable<Appointment[]> {

        return this.http
            .get<Appointment[]>(this.apiUrl)
            .pipe(
                catchError(error => {
                    console.error(
                        'Failed to load appointments:',
                        error
                    );

                    return throwError(() => error);
                })
            );
    }


    // ========================================
    // GET APPOINTMENT BY ID
    // ========================================

    getAppointment(
        id: number
    ): Observable<Appointment> {

        return this.http
            .get<Appointment>(
                `${this.apiUrl}/${id}`
            )
            .pipe(
                catchError(error => {
                    console.error(
                        'Failed to load appointment:',
                        error
                    );

                    return throwError(() => error);
                })
            );
    }


    // ========================================
    // UPDATE APPOINTMENT STATUS
    // ========================================

    updateAppointmentStatus(
        id: number,
        status: string
    ): Observable<Appointment> {

        return this.http
            .put<Appointment>(
                `${this.apiUrl}/${id}/status`,
                { status }
            )
            .pipe(
                catchError(error => {
                    console.error(
                        'Failed to update appointment status:',
                        error
                    );

                    return throwError(() => error);
                })
            );
    }


    // ========================================
    // DELETE APPOINTMENT
    // ========================================

    deleteAppointment(
        id: number
    ): Observable<void> {

        return this.http
            .delete<void>(
                `${this.apiUrl}/${id}`
            )
            .pipe(
                catchError(error => {
                    console.error(
                        'Failed to delete appointment:',
                        error
                    );

                    return throwError(() => error);
                })
            );
    }

    // ========================================
    // GET COMMUNICATION HISTORY FOR AN APPOINTMENT
    // ========================================

    getCommunicationHistory(
        appointmentId: number
    ) {
        return this.http.get<CommunicationLog[]>(
            `${this.apiUrl}/${appointmentId}/communications`
        );
    }
}
