import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PatientService } from '../../../core/services/patient.service';
import { CreatePatientRequest, Patient, PatientProfile, UpdatePatientRequest } from '../../../core/models/patient.model';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  selector: 'app-patients',
  standalone: true,
  styleUrl: './patients.scss',
  templateUrl: './patients.html',
})
export class Patients implements OnInit {

  private readonly patientService = inject(PatientService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  patients = signal<Patient[]>([]);

  profileLoading = signal(false);

  archiving = signal(false);

  restoring = signal(false);

  loading = signal(true);

  errorMessage = signal('');

  successMessage = signal('');

  searchTerm = signal('');

  selectedStatus = signal('All');

  selectedPatient = signal<Patient | null>(null);

  selectedPatientProfile = signal<PatientProfile | null>(null);

  patientToArchive = signal<Patient | null>(null);

  showPatientModal = signal(false);

  showArchiveModal = signal(false);

  showFormModal = signal(false);

  saving = signal(false);

  deleting = signal(false);

  isEditMode = signal(false);

  formError = signal('');

  patientForm = this.fb.nonNullable.group({

    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]
    ],

    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]
    ],

    email: [
      '',
      [
        Validators.email,
        Validators.maxLength(200)
      ]
    ],

    phone: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(30)
      ]
    ],

    dateOfBirth: [
      ''
    ],

    gender: [
      ''
    ],

    address: [
      '',
      Validators.maxLength(500)
    ],

    emergencyContactName: [
      '',
      Validators.maxLength(150)
    ],

    emergencyContactPhone: [
      '',
      Validators.maxLength(30)
    ],

    isActive: [
      true
    ]

  });


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

        const patientId =
          Number(this.route.snapshot.queryParamMap.get('patientId'));

        if (patientId) {

          const patient =
            patients.find(
              x => x.id === patientId
            );

          if (patient) {
            this.openPatient(patient);
          }
        }
      },

      error: error => {

        console.error(
          'Failed to load patients:',
          error
        );

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


  // -----------------------------------------
  // VIEW PATIENT
  // -----------------------------------------

  openPatient(patient: Patient): void {

    this.selectedPatient.set(patient);

    this.selectedPatientProfile.set(null);

    this.profileLoading.set(true);

    this.showPatientModal.set(true);

    this.patientService
      .getPatientProfile(patient.id)
      .subscribe({

        next: profile => {

          this.selectedPatientProfile.set(
            profile
          );

          this.profileLoading.set(false);

        },

        error: error => {

          console.error(
            'Failed to load patient profile:',
            error
          );

          this.profileLoading.set(false);

        }

      });
  }

  closePatientModal(): void {

    this.showPatientModal.set(false);

    this.selectedPatient.set(null);

    this.selectedPatientProfile.set(null);

    this.profileLoading.set(false);

  }

  // -----------------------------------------
  // ADD PATIENT
  // -----------------------------------------

  openAddPatient(): void {

    this.isEditMode.set(false);

    this.selectedPatient.set(null);

    this.formError.set('');

    this.successMessage.set('');

    this.patientForm.reset({

      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      isActive: true

    });

    this.showFormModal.set(true);

  }


  // -----------------------------------------
  // EDIT PATIENT
  // -----------------------------------------

  openEditPatient(patient: Patient): void {

    this.isEditMode.set(true);

    this.selectedPatient.set(patient);

    this.formError.set('');

    this.successMessage.set('');

    const dateOfBirth = patient.dateOfBirth
      ? patient.dateOfBirth.substring(0, 10)
      : '';

    this.patientForm.reset({

      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email ?? '',
      phone: patient.phone,
      dateOfBirth,
      gender: patient.gender ?? '',
      address: patient.address ?? '',
      emergencyContactName:
        patient.emergencyContactName ?? '',
      emergencyContactPhone:
        patient.emergencyContactPhone ?? '',
      isActive: patient.isActive

    });

    this.showFormModal.set(true);

  }


  closeFormModal(): void {

    if (this.saving()) {
      return;
    }

    this.showFormModal.set(false);

    this.formError.set('');

    this.patientForm.reset({

      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      isActive: true

    });

  }


  // -----------------------------------------
  // SAVE PATIENT
  // -----------------------------------------

  savePatient(): void {

    this.formError.set('');

    this.successMessage.set('');

    if (this.patientForm.invalid) {

      this.patientForm.markAllAsTouched();

      this.formError.set(
        'Please correct the highlighted fields.'
      );

      return;
    }

    this.saving.set(true);

    const formValue = this.patientForm.getRawValue();

    if (this.isEditMode()) {

      const patient = this.selectedPatient();

      if (!patient) {

        this.saving.set(false);

        return;

      }

      const request: UpdatePatientRequest = {

        firstName: formValue.firstName.trim(),

        lastName: formValue.lastName.trim(),

        email: formValue.email.trim() || null,

        phone: formValue.phone.trim(),

        dateOfBirth:
          formValue.dateOfBirth || null,

        gender:
          formValue.gender.trim() || null,

        address:
          formValue.address.trim() || null,

        emergencyContactName:
          formValue.emergencyContactName.trim() || null,

        emergencyContactPhone:
          formValue.emergencyContactPhone.trim() || null,

        isActive: formValue.isActive

      };

      this.patientService
        .updatePatient(patient.id, request)
        .subscribe({

          next: updatedPatient => {

            this.patients.update(
              patients =>
                patients.map(item =>
                  item.id === updatedPatient.id
                    ? updatedPatient
                    : item
                )
            );

            this.selectedPatient.set(
              updatedPatient
            );

            this.saving.set(false);

            this.showFormModal.set(false);

            this.successMessage.set(
              'Patient updated successfully.'
            );

          },

          error: error => {

            console.error(
              'Failed to update patient:',
              error
            );

            this.saving.set(false);

            this.formError.set(
              'Unable to update patient. Please try again.'
            );

          }

        });

      return;
    }

    // -----------------------------------------
    // CREATE
    // -----------------------------------------

    const request: CreatePatientRequest = {

      firstName: formValue.firstName.trim(),

      lastName: formValue.lastName.trim(),

      email: formValue.email.trim() || null,

      phone: formValue.phone.trim(),

      dateOfBirth:
        formValue.dateOfBirth || null,

      gender:
        formValue.gender.trim() || null,

      address:
        formValue.address.trim() || null,

      emergencyContactName:
        formValue.emergencyContactName.trim() || null,

      emergencyContactPhone:
        formValue.emergencyContactPhone.trim() || null

    };

    this.patientService
      .createPatient(request)
      .subscribe({

        next: newPatient => {

          this.patients.update(
            patients => [
              newPatient,
              ...patients
            ]
          );

          this.saving.set(false);

          this.showFormModal.set(false);

          this.successMessage.set(
            `Patient ${newPatient.patientNumber} created successfully.`
          );

        },

        error: error => {

          console.error(
            'Failed to create patient:',
            error
          );

          this.saving.set(false);

          this.formError.set(
            'Unable to create patient. Please try again.'
          );

        }

      });

  }


  // -----------------------------------------
  // ARCHIVE PATIENT
  // -----------------------------------------

  openArchiveModal(patient: Patient): void {

    this.patientToArchive.set(patient);

    this.showArchiveModal.set(true);

  }


  closeArchiveModal(): void {

    if (this.archiving()) {
      return;
    }

    this.showArchiveModal.set(false);

    this.patientToArchive.set(null);

  }


  archivePatient(): void {

    const patient = this.patientToArchive();

    if (!patient) {
      return;
    }

    this.archiving.set(true);

    this.patientService
      .archivePatient(patient.id)
      .subscribe({

        next: () => {

          this.patients.update(
            patients =>
              patients.map(item =>
                item.id === patient.id
                  ? {
                    ...item,
                    isActive: false,
                    updatedAt: new Date().toISOString()
                  }
                  : item
              )
          );

          this.archiving.set(false);

          this.closeArchiveModal();

          this.successMessage.set(
            `${patient.patientNumber} has been archived.`
          );

        },

        error: error => {

          console.error(
            'Failed to archive patient:',
            error
          );

          this.archiving.set(false);

          this.errorMessage.set(
            'Unable to archive patient. Please try again.'
          );

        }

      });

  }


  // -----------------------------------------
  // RESTORE PATIENT
  // -----------------------------------------

  restorePatient(patient: Patient): void {

    this.restoring.set(true);

    this.patientService
      .restorePatient(patient.id)
      .subscribe({

        next: () => {

          this.patients.update(
            patients =>
              patients.map(item =>
                item.id === patient.id
                  ? {
                    ...item,
                    isActive: true,
                    updatedAt: new Date().toISOString()
                  }
                  : item
              )
          );

          this.restoring.set(false);

          this.successMessage.set(
            `${patient.patientNumber} has been restored.`
          );

        },

        error: error => {

          console.error(
            'Failed to restore patient:',
            error
          );

          this.restoring.set(false);

          this.errorMessage.set(
            'Unable to restore patient. Please try again.'
          );

        }

      });

  }

  // -----------------------------------------
  // FORM HELPERS
  // -----------------------------------------

  isInvalid(controlName: string): boolean {

    const control =
      this.patientForm.get(controlName);

    return !!control &&
      control.invalid &&
      control.touched;

  }
}
