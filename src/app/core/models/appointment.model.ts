export interface CreateAppointmentRequest {

    firstName: string;

    lastName: string;

    email: string;

    phone: string;

    service: string;

    preferredDate: string;

    preferredTime: string;

    message?: string;

}


export interface AppointmentResponse {

    id: number;

    referenceNumber: string;

    status: string;

    message: string;

}


export interface Appointment {

    id: number;

    referenceNumber: string;

    firstName: string;

    lastName: string;

    email: string;

    phone: string;

    service: string;

    preferredDate: string;

    preferredTime: string;

    message?: string;

    status: string;

    createdAt: string;

    updatedAt?: string | null;

}