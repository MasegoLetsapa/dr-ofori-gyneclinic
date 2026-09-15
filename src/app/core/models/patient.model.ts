export interface Patient {
    id: number;
    patientNumber: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phone: string;
    dateOfBirth?: string | null;
    gender?: string | null;
    address?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string | null;
}

export interface CreatePatientRequest {
    firstName: string;
    lastName: string;
    email?: string | null;
    phone: string;
    dateOfBirth?: string | null;
    gender?: string | null;
    address?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
}

export interface UpdatePatientRequest {
    firstName: string;
    lastName: string;
    email?: string | null;
    phone: string;
    dateOfBirth?: string | null;
    gender?: string | null;
    address?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    isActive: boolean;
}

export interface PatientAppointment {
    id: number;
    referenceNumber: string;
    service: string;
    preferredDate: string;
    preferredTime: string;
    status: string;
    message?: string | null;
    createdAt: string;
}

export interface PatientProfile extends Patient {
    appointments: PatientAppointment[];
}