import { Component, inject } from '@angular/core';
import {
  FormBuilder, ReactiveFormsModule, Validators
} from '@angular/forms';
import { Icon } from "../../shared/icon/icon";
import { AppointmentService } from '../../core/services/appointment.service';
import { CreateAppointmentRequest } from '../../core/models/appointment.model';

@Component({
  imports: [ReactiveFormsModule, Icon],
  selector: 'app-appointment',
  standalone: true,
  styleUrl: './appointment.scss',
  templateUrl: './appointment.html',
})
export class Appointment {
  private readonly fb = inject(FormBuilder);

  private readonly appointmentService =
    inject(AppointmentService);

  submitted = false;
  submitting = false;

  successMessage = '';
  errorMessage = '';

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

  get minDate(): string {

    const today = new Date();

    return today.toISOString().split('T')[0];

  }


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
