import { Component, computed, inject, signal } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/appointment.model';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-appointments',
  standalone: true,
  styleUrl: './appointments.scss',
  templateUrl: './appointments.html',
})
export class Appointments {

  private readonly appointmentService = inject(AppointmentService);

  // ========================================
  // STATE
  // ========================================

  appointments = signal<Appointment[]>([]);

  loading = signal(false);

  error = signal<string | null>(null);


  // ========================================
  // APPOINTMENT COUNTS
  // ========================================

  totalAppointments = computed(() =>
    this.appointments().length
  );

  pendingAppointments = computed(() =>
    this.appointments().filter(
      appointment => appointment.status.toLowerCase() === 'pending'
    ).length
  );

  confirmedAppointments = computed(() =>
    this.appointments().filter(
      appointment => appointment.status.toLowerCase() === 'confirmed'
    ).length
  );

  completedAppointments = computed(() =>
    this.appointments().filter(
      appointment => appointment.status.toLowerCase() === 'completed'
    ).length
  );

  cancelledAppointments = computed(() =>
    this.appointments().filter(
      appointment => appointment.status.toLowerCase() === 'cancelled'
    ).length
  );


  // ========================================
  // INITIALIZE
  // ========================================

  ngOnInit(): void {
    this.loadAppointments();
  }


  // ========================================
  // LOAD APPOINTMENTS
  // ========================================

  loadAppointments(): void {

    this.loading.set(true);

    this.error.set(null);

    this.appointmentService
      .getAppointments()
      .subscribe({
        next: appointments => {

          this.appointments.set(appointments);

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Failed to load appointments:',
            error
          );

          this.error.set(
            'Unable to load appointments. Please try again.'
          );

          this.loading.set(false);
        }
      });
  }


  // ========================================
  // REFRESH
  // ========================================

  refreshAppointments(): void {
    this.loadAppointments();
  }

}
