import { inject, Service, signal } from '@angular/core';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Service()
export class AuthService {

    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private readonly apiUrl =
        'https://letsapamasego-001-site1.ltempurl.com/api/auth';


    // ========================================
    // AUTHENTICATED STATE
    // ========================================

    private readonly authenticated =
        signal<boolean>(this.hasValidToken());

    readonly isAuthenticated =
        this.authenticated.asReadonly();


    // ========================================
    // LOGIN
    // ========================================

    login(credentials: LoginRequest) {

        return this.http.post<LoginResponse>(
            `${this.apiUrl}/login`,
            credentials
        );

    }


    // ========================================
    // SAVE SESSION
    // ========================================

    setSession(response: LoginResponse): void {

        localStorage.setItem(
            'access_token',
            response.token
        );

        localStorage.setItem(
            'auth_user',
            JSON.stringify({
                userId: response.userId,
                firstName: response.firstName,
                lastName: response.lastName,
                email: response.email,
                role: response.role
            })
        );

        localStorage.setItem(
            'token_expires_at',
            response.expiresAt
        );

        this.authenticated.set(true);

    }


    // ========================================
    // TOKEN
    // ========================================

    getToken(): string | null {

        return localStorage.getItem(
            'access_token'
        );

    }


    // ========================================
    // LOGOUT
    // ========================================

    logout(): void {

        localStorage.removeItem(
            'access_token'
        );

        localStorage.removeItem(
            'auth_user'
        );

        localStorage.removeItem(
            'token_expires_at'
        );

        this.authenticated.set(false);

        this.router.navigate([
            '/admin/login'
        ]);

    }


    // ========================================
    // CURRENT USER
    // ========================================

    getCurrentUser(): {
        userId: number;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    } | null {

        const user =
            localStorage.getItem('auth_user');

        if (!user) {
            return null;
        }

        try {
            return JSON.parse(user);
        } catch {
            return null;
        }

    }


    // ========================================
    // TOKEN VALIDATION
    // ========================================

    private hasValidToken(): boolean {

        const token =
            localStorage.getItem('access_token');

        const expiresAt =
            localStorage.getItem(
                'token_expires_at'
            );

        if (!token || !expiresAt) {
            return false;
        }

        const expiration =
            new Date(expiresAt).getTime();

        if (
            Number.isNaN(expiration) ||
            expiration <= Date.now()
        ) {

            localStorage.removeItem(
                'access_token'
            );

            localStorage.removeItem(
                'auth_user'
            );

            localStorage.removeItem(
                'token_expires_at'
            );

            return false;
        }

        return true;

    }

}
