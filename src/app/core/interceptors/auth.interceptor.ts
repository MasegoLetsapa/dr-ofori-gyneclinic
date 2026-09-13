import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AuthService } from '../services/auth.service';


export const authInterceptor: HttpInterceptorFn =
    (req, next) => {

        const authService =
            inject(AuthService);

        const token =
            authService.getToken();


        // No token → send request normally

        if (!token) {
            return next(req);
        }


        // Attach JWT

        const authenticatedRequest =
            req.clone({
                setHeaders: {
                    Authorization:
                        `Bearer ${token}`
                }
            });


        return next(
            authenticatedRequest
        );

    };
