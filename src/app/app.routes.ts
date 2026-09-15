import { Routes } from '@angular/router';
import { Appointments } from './pages/admin/appointments/appointments';
import { Home } from './pages/home/home';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { Login } from './pages/admin/login/login';
import { authGuard } from './core/guards/auth.guard';
import { Patients } from './pages/admin/patients/patients';
import { Services } from './pages/admin/services/services';

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
        children: [

            // PUBLIC LOGIN

            {
                path: 'login',
                component: Login
            },

            // PROTECTED ADMIN AREA
            {
                path: '',
                component: AdminLayout,
                canActivate: [authGuard],

                children: [
                    {
                        path: '',
                        component: Dashboard
                    },
                    // APPPOINTMENTS
                    {
                        path: 'appointments',
                        component: Appointments
                    },
                    // PATIENTS
                    {
                        path: 'patients',
                        component: Patients
                    },
                    // SERVICES
                    {
                        path: 'services',
                        component: Services
                    }
                ]
            },

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
