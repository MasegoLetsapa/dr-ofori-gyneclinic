export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    expiresAt: string;
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}