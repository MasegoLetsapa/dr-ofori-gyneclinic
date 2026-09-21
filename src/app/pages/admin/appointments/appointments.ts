import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment, CommunicationLog } from '../../../core/models/appointment.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  imports: [DatePipe],
  selector: 'app-appointments',
  standalone: true,
  styleUrl: './appointments.scss',
  templateUrl: './appointments.html',
})
export class Appointments {

  private readonly appointmentService = inject(AppointmentService);

  private readonly router = inject(Router);

  private readonly cdr = inject(ChangeDetectorRef);

  // ========================================
  // COMMUNICATION HISTORY
  // ========================================

  communicationHistory: CommunicationLog[] = [];
  communicationsLoading = false;
  communicationsError = '';

  getCommunicationTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      AppointmentAdminNotification: 'Clinic Notification',
      MessageAdminNotification: 'Message Notification',
      PatientRequestReceived: 'Request Received',
      PatientConfirmed: 'Appointment Confirmed',
      PatientCancelled: 'Appointment Cancelled',
      PatientReminder: 'Appointment Reminder'
    };

    return labels[type] ?? type;
  }


  // ========================================
  // STATE
  // ========================================

  appointments = signal<Appointment[]>([]);

  loading = signal(false);

  error = signal<string | null>(null);

  selectedAppointment = signal<Appointment | null>(null);

  updatingStatus = signal(false);

  deletingAppointment = signal(false);

  appointmentToDelete = signal<Appointment | null>(null);

  searchTerm = signal('');
  selectedStatus = signal('All');

  filteredAppointments = computed(() => {

    const search = this.searchTerm()
      .trim()
      .toLowerCase();

    const status = this.selectedStatus();

    return this.appointments().filter(appointment => {

      const matchesSearch =
        !search ||
        appointment.referenceNumber.toLowerCase().includes(search) ||
        appointment.firstName.toLowerCase().includes(search) ||
        appointment.lastName.toLowerCase().includes(search) ||
        appointment.email.toLowerCase().includes(search) ||
        appointment.phone.toLowerCase().includes(search) ||
        appointment.service.toLowerCase().includes(search);

      const matchesStatus =
        status === 'All' ||
        appointment.status.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesStatus;
    });

  });

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

  // ========================================
  // VIEW APPOINTMENT
  // ========================================

  viewAppointment(appointment: Appointment): void {

    this.selectedAppointment.set(appointment);

    this.communicationHistory = [];
    this.communicationsLoading = true;
    this.communicationsError = '';

    this.appointmentService
      .getCommunicationHistory(appointment.id)
      .subscribe({
        next: communications => {
          console.log(
            'Communication history received:',
            communications
          );

          this.communicationHistory = communications;
          this.communicationsLoading = false;

          this.cdr.markForCheck();
        },

        error: error => {
          console.error(
            'Communication history request failed:',
            error
          );

          this.communicationsLoading = false;
          this.communicationsError =
            'Unable to load communication history.';

          this.cdr.markForCheck();
        }
      });


  }

  // ========================================
  // VIEW PATIENT
  // 

  viewPatient(patientId: number): void {
    this.router.navigate(
      ['/admin/patients'],
      {
        queryParams: {
          patientId
        }
      }
    );
  }


  // ========================================
  // CLOSE APPOINTMENT DETAILS
  // ========================================

  closeAppointmentDetails(): void {
    this.selectedAppointment.set(null);
  }

  // ========================================
  // SERVICE HELPER
  // ========================================



  serviceName(appointment: Appointment): string {

    if (appointment.serviceNavigation?.name) {
      return appointment.serviceNavigation.name;
    }

    if (appointment.service) {
      return appointment.service
        .replace(/-/g, ' ')
        .replace(/\b\w/g, letter => letter.toUpperCase());
    }

    return 'Unknown Service';
  }


  // ========================================
  // UPDATE APPOINTMENT STATUS
  // ========================================

  updateStatus(status: string): void {

    const appointment = this.selectedAppointment();

    if (!appointment) {
      return;
    }

    this.updatingStatus.set(true);

    this.appointmentService
      .updateAppointmentStatus(
        appointment.id,
        status
      )
      .subscribe({

        next: updatedAppointment => {

          // Update the appointment in the local list
          this.appointments.update(
            appointments =>
              appointments.map(item =>
                item.id === updatedAppointment.id
                  ? updatedAppointment
                  : item
              )
          );

          // Update the appointment currently
          // displayed in the modal
          this.selectedAppointment.set(
            updatedAppointment
          );

          this.updatingStatus.set(false);
        },

        error: error => {

          console.error(
            'Failed to update appointment status:',
            error
          );

          this.error.set(
            'Unable to update the appointment status. Please try again.'
          );

          this.updatingStatus.set(false);
        }

      });
  }

  // ========================================
  // SEARCH
  // ========================================

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }


  // ========================================
  // STATUS FILTER
  // ========================================

  setStatusFilter(status: string): void {
    this.selectedStatus.set(status);
  }

  // ========================================
  // OPEN DELETE CONFIRMATION
  // ========================================

  confirmDelete(appointment: Appointment): void {
    this.appointmentToDelete.set(appointment);
  }


  // ========================================
  // CLOSE DELETE CONFIRMATION
  // ========================================

  cancelDelete(): void {
    this.appointmentToDelete.set(null);
  }


  // ========================================
  // DELETE APPOINTMENT
  // ========================================

  deleteAppointment(): void {

    const appointment = this.appointmentToDelete();

    if (!appointment) {
      return;
    }

    this.deletingAppointment.set(true);

    this.appointmentService
      .deleteAppointment(appointment.id)
      .subscribe({

        next: () => {

          // Remove appointment from local list
          this.appointments.update(
            appointments =>
              appointments.filter(
                item => item.id !== appointment.id
              )
          );

          // Close delete confirmation
          this.appointmentToDelete.set(null);

          // Close details modal if it is open
          if (
            this.selectedAppointment()?.id === appointment.id
          ) {
            this.selectedAppointment.set(null);
          }

          this.deletingAppointment.set(false);
        },

        error: error => {

          console.error(
            'Failed to delete appointment:',
            error
          );

          this.error.set(
            'Unable to delete the appointment. Please try again.'
          );

          this.deletingAppointment.set(false);
        }

      });
  }

}
