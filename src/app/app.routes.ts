import { Routes } from '@angular/router';
import { Appointments } from './pages/admin/appointments/appointments';
import { Home } from './pages/home/home';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { Login } from './pages/admin/login/login';
import { authGuard } from './core/guards/auth.guard';
import { Patients } from './pages/admin/patients/patients';
import { Services } from './pages/admin/services/services';
import { Messages } from './pages/admin/messages/messages';
import { Settings } from './pages/admin/settings/settings';
import { PublicServices } from './features/public-services/public-services';
import { Resources } from './features/resources/resources';
import { ArticleDetail } from './features/article-detail/article-detail';
import { Articles } from './pages/admin/articles/articles';
import { ArticleEditor } from './pages/admin/articles/article-editor/article-editor';

export const routes: Routes = [
    // ========================================
    // PUBLIC WEBSITE
    // ========================================

    {
        path: '',
        component: Home
    },
    {
        path: 'services',
        component: PublicServices
    },
    {
        path: 'resources',
        component: Resources
    },
    {
        path: 'resources/:slug',
        component: ArticleDetail
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
                    },
                    // ARTICLES
                    {
                        path: 'articles/new',
                        component: ArticleEditor
                    },
                    {
                        path: 'articles/:id/edit',
                        component: ArticleEditor
                    },
                    {
                        path: 'articles',
                        component: Articles
                    },
                    // MESSAGES
                    {
                        path: 'messages',
                        component: Messages
                    },
                    // Settings
                    {
                        path: 'settings',
                        component: Settings
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
