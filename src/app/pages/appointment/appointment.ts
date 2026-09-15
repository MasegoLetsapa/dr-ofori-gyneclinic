import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder, ReactiveFormsModule, Validators
} from '@angular/forms';
import { Icon } from "../../shared/icon/icon";
import { AppointmentService } from '../../core/services/appointment.service';
import { CreateAppointmentRequest } from '../../core/models/appointment.model';
import { ClinicService } from '../../core/models/service.model';
import { ServiceService } from '../../core/services/service.service';

@Component({
  imports: [ReactiveFormsModule, Icon],
  selector: 'app-appointment',
  standalone: true,
  styleUrl: './appointment.scss',
  templateUrl: './appointment.html',
})
export class Appointment implements OnInit {
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

  // ========================================
  // INITIALIZATION
  // ========================================

  ngOnInit(): void {

    this.loadServices();

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

          console.log(
            'Appointment created:',
            response
          );

          this.submitting = false;

          this.successMessage =
            'Your appointment request has been received. Our team will contact you to confirm your appointment.';

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
