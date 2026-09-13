import { Routes } from '@angular/router';
import { Appointments } from './pages/admin/appointments/appointments';
import { Home } from './pages/home/home';
import { AdminLayout } from './layout/admin-layout/admin-layout';

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
        path: 'admin',
        component: AdminLayout,
        children: [

            {
                path: '',
                redirectTo: 'appointments',
                pathMatch: 'full'
            },

            {
                path: 'appointments',
                component: Appointments
            }

        ]
    },

    // ========================================
    // FALLBACK
    // ========================================

    {
        path: '**',
        redirectTo: ''
    }
];
