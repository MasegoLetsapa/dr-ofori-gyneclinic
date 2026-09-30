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
import { VisitorIdService } from '../../core/services/visitor-id';
import { TrafficSourceService } from '../../core/services/traffic-source.service';

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

  private readonly visitorIdService =
    inject(VisitorIdService);

  private readonly trafficSourceService =
    inject(TrafficSourceService);

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

    practiceLocation: [
      '',
      [Validators.required]
    ],

    message: [
      '',
      Validators.maxLength(500)
    ]
  });

  // ========================================
  // PRACTICE LOCATION
  // ========================================

  clinicClosedMessage = '';

  onDateChanged(): void {
    const dateValue =
      this.appointmentForm.controls.preferredDate.value;

    this.clinicClosedMessage = '';

    if (!dateValue) {
      this.appointmentForm.controls.practiceLocation.setValue('');
      return;
    }

    const [year, month, day] =
      dateValue.split('-').map(Number);

    const selectedDate =
      new Date(year, month - 1, day);

    const dayOfWeek =
      selectedDate.getDay();

    // Sunday = clinic closed
    if (dayOfWeek === 0) {
      this.appointmentForm.controls.practiceLocation.setValue('');

      this.clinicClosedMessage =
        'The clinic is closed on Sundays. Please select another appointment date.';

      return;
    }

    // Thursday = Lichtenburg
    if (dayOfWeek === 4) {
      this.appointmentForm.controls.practiceLocation.setValue(
        'Lichtenburg'
      );

      return;
    }

    // Monday–Wednesday, Friday–Saturday = Mahikeng
    this.appointmentForm.controls.practiceLocation.setValue(
      'Mahikeng'
    );
  }

  get selectedPracticeLocation(): string {
    return this.appointmentForm.controls.practiceLocation.value ?? '';
  }

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

    const year =
      today.getFullYear();

    const month =
      String(today.getMonth() + 1).padStart(2, '0');

    const day =
      String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;

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

    if (this.clinicClosedMessage) {
      return;
    }

    this.submitting = true;


    const formValue =
      this.appointmentForm.getRawValue();


    const visitorId =
      this.visitorIdService.getVisitorId();

    const trafficData =
      this.trafficSourceService.getTrafficData();

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

      practiceLocation: formValue.practiceLocation ?? '',

      message:
        formValue.message ?? '',

      visitorId,

      sessionId:
        trafficData.sessionId,

      trafficSource:
        trafficData.trafficSource,

      trafficMedium:
        trafficData.trafficMedium,

      trafficCampaign:
        trafficData.trafficCampaign
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
