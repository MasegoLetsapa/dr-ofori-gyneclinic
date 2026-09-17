export interface PublicClinicSettings {
    clinicName: string;
    email: string;
    phone: string;
    whatsApp?: string | null;
    website?: string | null;
    address: string;
    bookingEnabled: boolean;
}