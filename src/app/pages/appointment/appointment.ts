import { Component, inject } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators
} from '@angular/forms';
import { Icon } from "../../shared/icon/icon";

@Component({
  imports: [ReactiveFormsModule, Icon],
  selector: 'app-appointment',
  standalone: true,
  styleUrl: './appointment.scss',
  templateUrl: './appointment.html',
})
export class Appointment {
  private readonly fb = inject(FormBuilder);

  submitted = false;
  submitting = false;

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

    console.log(
      'Appointment request:',
      this.appointmentForm.getRawValue()
    );

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

    setTimeout(() => {
      this.submitting = false;
      this.appointmentForm.reset();
      this.submitted = false;
    }, 1200);
  }
}
