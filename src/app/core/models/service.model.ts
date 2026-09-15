export interface ClinicService {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    durationMinutes: number;
    price?: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string | null;
}

export interface CreateServiceRequest {
    name: string;
    description?: string | null;
    durationMinutes: number;
    price?: number | null;
}

export interface UpdateServiceRequest {
    name: string;
    description?: string | null;
    durationMinutes: number;
    price?: number | null;
    isActive: boolean;
}