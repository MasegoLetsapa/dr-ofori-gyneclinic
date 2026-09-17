import { Component, inject, OnInit, signal } from '@angular/core';
import { Icon } from '../../../shared/icon/icon';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../../core/services/message.service';
import { CreateMessageRequest } from '../../../core/models/message.model';
import { ClinicSettingsService } from '../../../core/services/clinic-settings.service';
import { PublicClinicSettings } from '../../../core/models/public-clinic-settings.model';

@Component({
  imports: [ReactiveFormsModule, Icon],
  selector: 'app-contact',
  styleUrl: './contact.scss',
  templateUrl: './contact.html',
})
export class Contact implements OnInit {

  private readonly clinicSettingsService = inject(ClinicSettingsService);

  clinicSettings = signal<PublicClinicSettings | null>(null);

  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);

  submitted = false;
  submitting = false;

  successMessage = '';
  errorMessage = '';

  contactForm = this.fb.group({
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
        Validators.required,
        Validators.email,
        Validators.maxLength(200)
      ]
    ],

    phone: [
      '',
      [
        Validators.maxLength(30)
      ]
    ],

    subject: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200)
      ]
    ],

    messageBody: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(2000)
      ]
    ]
  });

  ngOnInit(): void {
    this.clinicSettingsService.getSettings().subscribe({
      next: (settings) => {
        this.clinicSettings.set(settings);
      },
      error: (error) => {
        console.error('Failed to load clinic settings:', error);
      }
    });
  }

  get firstName() {
    return this.contactForm.controls.firstName;
  }

  get lastName() {
    return this.contactForm.controls.lastName;
  }

  get email() {
    return this.contactForm.controls.email;
  }

  get phone() {
    return this.contactForm.controls.phone;
  }

  get subject() {
    return this.contactForm.controls.subject;
  }

  get messageBody() {
    return this.contactForm.controls.messageBody;
  }

  submitMessage(): void {

    this.submitted = true;

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitting = true;

    this.successMessage = '';
    this.errorMessage = '';

    const formValue =
      this.contactForm.getRawValue();

    const request: CreateMessageRequest = {

      firstName:
        formValue.firstName ?? '',

      lastName:
        formValue.lastName ?? '',

      email:
        formValue.email ?? '',

      phone:
        formValue.phone ?? '',

      subject:
        formValue.subject ?? '',

      messageBody:
        formValue.messageBody ?? ''
    };

    this.messageService
      .createMessage(request)
      .subscribe({

        next: response => {

          console.log(
            'Message submitted:',
            response
          );

          this.submitting = false;

          this.successMessage =
            'Thank you. Your message has been received and our team will get back to you.';

          this.errorMessage = '';

          this.contactForm.reset();

          this.submitted = false;
        },

        error: error => {

          console.error(
            'Unable to submit message:',
            error
          );

          this.submitting = false;

          this.errorMessage =
            'We could not send your message right now. Please try again or contact the clinic directly.';

          this.successMessage = '';
        }

      });
  }
}
