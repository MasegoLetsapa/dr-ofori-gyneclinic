import { Routes } from '@angular/router';
import { Appointments } from './pages/admin/appointments/appointments';
import { Home } from './pages/home/home';

export const routes: Routes = [
    // ========================================
    // PUBLIC WEBSITE
    // ========================================

    {
        path: '',
        component: Home
    },

    // ========================================
    // ADMIN
    // ========================================

    {
        path: 'admin/appointments',
        component: Appointments
    },

    // ========================================
    // FALLBACK
    // ========================================

    {
        path: '**',
        redirectTo: ''
    }
];
