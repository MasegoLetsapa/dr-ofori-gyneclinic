import { Patient } from "./patient.model";


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


/**
 * Service information returned with an appointment.
 */
export interface AppointmentService {

    id: number;

    name: string;

    slug: string;

    description?: string | null;

    durationMinutes?: number | null;

    price?: number | null;

    isActive: boolean;

}


/**
 * Appointment record.
 */
export interface Appointment {

    id: number;

    referenceNumber: string;

    firstName: string;

    lastName: string;

    email: string;

    phone: string;

    // Legacy service slug.
    // Example: "pregnancy-care"
    service: string;

    // New Service relationship.
    serviceId?: number | null;

    serviceNavigation?: AppointmentService | null;

    preferredDate: string;

    preferredTime: string;

    message?: string | null;

    status: string;

    createdAt: string;

    updatedAt?: string | null;

    // Patient relationship.
    patientId?: number | null;

    patient?: Patient | null;

}