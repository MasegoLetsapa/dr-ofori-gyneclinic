export interface ClinicSettings {
    id: number;

    clinicName: string;
    email: string;
    phone: string;
    whatsApp?: string | null;
    website?: string | null;
    address: string;

    openingTime: string;
    closingTime: string;
    appointmentDurationMinutes: number;
    bookingEnabled: boolean;

    notificationEmail?: string | null;
    appointmentNotificationsEnabled: boolean;
    messageNotificationsEnabled: boolean;

    updatedAt: string;
}

export interface UpdateClinicSettingsRequest {
    clinicName: string;
    email: string;
    phone: string;
    whatsApp?: string;
    website?: string;
    address: string;

    openingTime: string;
    closingTime: string;
    appointmentDurationMinutes: number;
    bookingEnabled: boolean;

    notificationEmail?: string;
    appointmentNotificationsEnabled: boolean;
    messageNotificationsEnabled: boolean;
}

export interface SettingsResponse {
    message: string;
    settings: ClinicSettings;
}