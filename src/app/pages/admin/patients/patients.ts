import { Component, computed, inject, signal } from '@angular/core';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../core/models/patient.model';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  imports: [FormsModule, DatePipe],
  selector: 'app-patients',
  styleUrl: './patients.scss',
  templateUrl: './patients.html',
})
export class Patients {
  private readonly patientService = inject(PatientService);

  patients = signal<Patient[]>([]);

  loading = signal(true);

  errorMessage = signal('');

  searchTerm = signal('');

  selectedStatus = signal('All');

  selectedPatient = signal<Patient | null>(null);

  showPatientModal = signal(false);

  showDeleteModal = signal(false);

  patientToDelete = signal<Patient | null>(null);

  saving = signal(false);

  deleting = signal(false);

  filteredPatients = computed(() => {

    const search = this.searchTerm()
      .trim()
      .toLowerCase();

    const status = this.selectedStatus();

    return this.patients().filter(patient => {

      const matchesSearch =
        !search ||
        patient.patientNumber
          .toLowerCase()
          .includes(search) ||
        patient.firstName
          .toLowerCase()
          .includes(search) ||
        patient.lastName
          .toLowerCase()
          .includes(search) ||
        patient.phone
          .toLowerCase()
          .includes(search) ||
        (patient.email ?? '')
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        status === 'All' ||
        (status === 'Active' && patient.isActive) ||
        (status === 'Inactive' && !patient.isActive);

      return matchesSearch && matchesStatus;
    });
  });

  totalPatients = computed(() =>
    this.patients().length
  );

  activePatients = computed(() =>
    this.patients().filter(x => x.isActive).length
  );

  inactivePatients = computed(() =>
    this.patients().filter(x => !x.isActive).length
  );

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.patientService.getPatients().subscribe({

      next: patients => {
        this.patients.set(patients);
        this.loading.set(false);
      },

      error: error => {
        console.error('Failed to load patients:', error);

        this.errorMessage.set(
          'Unable to load patients. Please try again.'
        );

        this.loading.set(false);
      }
    });
  }

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  setStatus(value: string): void {
    this.selectedStatus.set(value);
  }

  openPatient(patient: Patient): void {
    this.selectedPatient.set(patient);
    this.showPatientModal.set(true);
  }

  closePatientModal(): void {
    this.showPatientModal.set(false);
    this.selectedPatient.set(null);
  }

  openDeleteModal(patient: Patient): void {
    this.patientToDelete.set(patient);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.patientToDelete.set(null);
  }

  deletePatient(): void {

    const patient = this.patientToDelete();

    if (!patient) {
      return;
    }

    this.deleting.set(true);

    this.patientService
      .deletePatient(patient.id)
      .subscribe({

        next: () => {

          this.patients.update(
            patients =>
              patients.filter(
                item => item.id !== patient.id
              )
          );

          this.deleting.set(false);

          this.closeDeleteModal();
        },

        error: error => {

          console.error(
            'Failed to delete patient:',
            error
          );

          this.deleting.set(false);
        }
      });
  }
}
