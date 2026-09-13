import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardActivity, DashboardAppointment } from '../../../core/models/dashboard.model';

@Component({
  imports: [RouterLink],
  standalone: true,
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard {

  private readonly dashboardService = inject(DashboardService);

  // ========================================
  // STATE
  // ========================================

  loading = signal(true);

  error = signal<string | null>(null);


  // ========================================
  // DASHBOARD DATA
  // ========================================

  totalAppointments = signal(0);

  pendingAppointments = signal(0);

  confirmedAppointments = signal(0);

  completedAppointments = signal(0);

  cancelledAppointments = signal(0);


  recentAppointments =
    signal<DashboardAppointment[]>([]);

  recentActivity =
    signal<DashboardActivity[]>([]);


  // ========================================
  // LOAD DASHBOARD
  // ========================================

  ngOnInit(): void {
    this.loadDashboard();
  }


  loadDashboard(): void {

    this.loading.set(true);

    this.error.set(null);

    this.dashboardService
      .getDashboard()
      .subscribe({

        next: data => {

          this.totalAppointments.set(
            data.totalAppointments
          );

          this.pendingAppointments.set(
            data.pendingAppointments
          );

          this.confirmedAppointments.set(
            data.confirmedAppointments
          );

          this.completedAppointments.set(
            data.completedAppointments
          );

          this.cancelledAppointments.set(
            data.cancelledAppointments
          );

          this.recentAppointments.set(
            data.recentAppointments
          );

          this.recentActivity.set(
            data.recentActivity
          );

          this.loading.set(false);

        },

        error: error => {

          console.error(
            'Dashboard loading failed:',
            error
          );

          this.error.set(
            'Unable to load dashboard data.'
          );

          this.loading.set(false);

        }

      });

  }
}
