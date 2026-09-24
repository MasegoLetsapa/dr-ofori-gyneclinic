import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder, ReactiveFormsModule, Validators
} from '@angular/forms';
import { Icon } from "../../shared/icon/icon";
import { AppointmentService } from '../../core/services/appointment.service';
import { CreateAppointmentRequest } from '../../core/models/appointment.model';
import { ClinicService } from '../../core/models/service.model';
import { ServiceService } from '../../core/services/service.service';
import { ClinicSettingsService } from '../../core/services/clinic-settings.service';
import { PublicClinicSettings } from '../../core/models/public-clinic-settings.model';
import { AppointmentModalService } from '../../core/services/appointment-modal.service';

@Component({
  imports: [ReactiveFormsModule, Icon],
  selector: 'app-appointment',
  standalone: true,
  styleUrl: './appointment.scss',
  templateUrl: './appointment.html',
})
export class Appointment implements OnInit {

  private readonly clinicSettingsService = inject(ClinicSettingsService);

  clinicSettings = signal<PublicClinicSettings | null>(null);


  private readonly appointmentModal = inject(AppointmentModalService);

  isOpen = this.appointmentModal.isOpen;

  open(): void {
    if (!this.clinicSettings()?.bookingEnabled) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.appointmentReference = '';
    this.submitted = false;
    this.submitting = false;
    this.appointmentForm.reset();

    this.appointmentModal.open();
  }

  close(): void {
    this.appointmentModal.close();
  }

  private readonly fb = inject(FormBuilder);

  private readonly appointmentService =
    inject(AppointmentService);

  private readonly serviceService =
    inject(ServiceService);

  // ========================================
  // SERVICES
  // ========================================

  services: ClinicService[] = [];

  servicesLoading = false;

  servicesError = '';

  // ========================================
  // FORM STATE
  // ========================================


  submitted = false;
  submitting = false;

  successMessage = '';
  errorMessage = '';
  appointmentReference = '';

  // ========================================
  // APPOINTMENT FORM
  // ========================================

  appointmentForm = this.fb.group({
    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    phone: [
      '',
      [
        Validators.required,
        Validators.minLength(10)
      ]
    ],

    service: [
      '',
      Validators.required
    ],

    preferredDate: [
      '',
      Validators.required
    ],

    preferredTime: [
      '',
      Validators.required
    ],

    message: [
      '',
      Validators.maxLength(500)
    ]
  });

  constructor() {

    effect(() => {

      const selectedService =
        this.appointmentModal.selectedService();

      if (!selectedService) {
        return;
      }

      this.appointmentForm.patchValue({
        service: selectedService.slug
      });

    });

  }

  // ========================================
  // INITIALIZATION
  // ========================================

  ngOnInit(): void {

    this.loadServices();

    this.clinicSettingsService.getSettings().subscribe({
      next: (settings) => {
        this.clinicSettings.set(settings);
      },
      error: (error) => {
        console.error('Failed to load clinic settings:', error);
      }
    });

  }

  // ========================================
  // LOAD SERVICES
  // ========================================

  private loadServices(): void {

    this.servicesLoading = true;

    this.servicesError = '';

    this.serviceService
      .getServices()
      .subscribe({

        next: services => {

          this.services =
            services.filter(
              service => service.isActive
            );

          this.servicesLoading = false;

        },

        error: error => {

          console.error(
            'Unable to load clinic services:',
            error
          );

          this.services = [];

          this.servicesLoading = false;

          this.servicesError =
            'We could not load our services right now. Please contact the clinic directly.';

        }

      });

  }

  // ========================================
  // FORM CONTROLS
  // ========================================

  get firstName() {
    return this.appointmentForm.controls.firstName;
  }

  get lastName() {
    return this.appointmentForm.controls.lastName;
  }

  get email() {
    return this.appointmentForm.controls.email;
  }

  get phone() {
    return this.appointmentForm.controls.phone;
  }

  get service() {
    return this.appointmentForm.controls.service;
  }

  get preferredDate() {
    return this.appointmentForm.controls.preferredDate;
  }

  get preferredTime() {
    return this.appointmentForm.controls.preferredTime;
  }

  // ========================================
  // MINIMUM DATE
  // ========================================


  get minDate(): string {

    const today = new Date();

    return today.toISOString().split('T')[0];

  }

  // ========================================
  // SUBMIT APPOINTMENT
  // ========================================


  submitAppointment(): void {

    this.submitted = true;

    if (!this.clinicSettings()?.bookingEnabled) {
      this.errorMessage =
        'Online booking is currently unavailable. Please contact the clinic directly.'
        ;
      return;
    }

    if (this.appointmentForm.invalid) {

      this.appointmentForm.markAllAsTouched();

      return;
    }

    this.submitting = true;


    const formValue =
      this.appointmentForm.getRawValue();


    const request: CreateAppointmentRequest = {

      firstName:
        formValue.firstName ?? '',

      lastName:
        formValue.lastName ?? '',

      email:
        formValue.email ?? '',

      phone:
        formValue.phone ?? '',

      service:
        formValue.service ?? '',

      preferredDate:
        formValue.preferredDate ?? '',

      preferredTime:
        formValue.preferredTime ?? '',

      message:
        formValue.message ?? ''

    };


    this.appointmentService
      .createAppointment(request)
      .subscribe({

        next: response => {

          this.submitting = false;

          this.successMessage =
            'Your appointment request has been received. Our team will contact you to confirm your appointment.';

          this.appointmentReference =
            response.referenceNumber;

          this.errorMessage = '';

          this.appointmentForm.reset();

          this.submitted = false;

        },

        error: error => {

          console.error(
            'Unable to create appointment:',
            error
          );

          this.submitting = false;

          this.errorMessage =
            'We could not submit your request right now. Please try again or contact the clinic directly.';

          this.successMessage = '';

        }

      });
  }

  resetAppointmentForm(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.appointmentReference = '';
    this.submitted = false;
    this.submitting = false;

    this.appointmentForm.reset();
  }

  /*
    API integration will be added here.

    Example later:

    this.appointmentService
      .createAppointment(this.appointmentForm.getRawValue())
      .subscribe({
        next: () => {
          this.submitting = false;
        },
        error: () => {
          this.submitting = false;
        }
      });
  */

  /*   setTimeout(() => {
      this.submitting = false;
      this.appointmentForm.reset();
      this.submitted = false;
    }, 1200);
  } */
}
