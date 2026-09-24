import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly settingsService = inject(SettingsService);

  isLoading = signal(false);
  isSaving = signal(false);

  successMessage = signal('');
  errorMessage = signal('');

  settingsForm = this.fb.group({

    // Clinic
    clinicName: [
      '',
      [
        Validators.required,
        Validators.maxLength(200)
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
        Validators.required,
        Validators.maxLength(30)
      ]
    ],

    whatsApp: [
      '',
      Validators.maxLength(30)
    ],

    website: [
      '',
      Validators.maxLength(200)
    ],

    address: [
      '',
      [
        Validators.required,
        Validators.maxLength(500)
      ]
    ],

    // Appointments
    openingTime: [
      '08:00'
    ],

    closingTime: [
      '17:00'
    ],

    appointmentDurationMinutes: [
      30,
      [
        Validators.required,
        Validators.min(5),
        Validators.max(480)
      ]
    ],

    bookingEnabled: [
      true
    ],

    // Notifications
    notificationEmail: [
      '',
      [
        Validators.email,
        Validators.maxLength(200)
      ]
    ],

    appointmentNotificationsEnabled: [
      true
    ],

    messageNotificationsEnabled: [
      true
    ]
  });

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.settingsService
      .getSettings()
      .subscribe({

        next: settings => {

          this.settingsForm.patchValue({

            clinicName:
              settings.clinicName,

            email:
              settings.email,

            phone:
              settings.phone,

            whatsApp:
              settings.whatsApp ?? '',

            website:
              settings.website ?? '',

            address:
              settings.address,

            openingTime:
              this.formatTime(settings.openingTime),

            closingTime:
              this.formatTime(settings.closingTime),

            appointmentDurationMinutes:
              settings.appointmentDurationMinutes,

            bookingEnabled:
              settings.bookingEnabled,

            notificationEmail:
              settings.notificationEmail ?? '',

            appointmentNotificationsEnabled:
              settings.appointmentNotificationsEnabled,

            messageNotificationsEnabled:
              settings.messageNotificationsEnabled
          });

          this.isLoading.set(false);
        },

        error: error => {

          console.error(
            'Unable to load clinic settings:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load clinic settings.'
          );

          this.isLoading.set(false);
        },

        complete: () => {

          this.isLoading.set(false);
        }
      });
  }

  saveSettings(): void {

    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.settingsForm.invalid) {

      this.settingsForm.markAllAsTouched();

      this.errorMessage.set(
        'Please correct the highlighted fields.'
      );

      return;
    }

    this.isSaving.set(true);

    const value =
      this.settingsForm.getRawValue();

    const request = {
      clinicName:
        value.clinicName?.trim() ?? '',

      email:
        value.email?.trim() ?? '',

      phone:
        value.phone?.trim() ?? '',

      whatsApp:
        value.whatsApp?.trim() || undefined,

      website:
        value.website?.trim() || undefined,

      address:
        value.address?.trim() ?? '',

      openingTime:
        this.toTimeSpan(value.openingTime),

      closingTime:
        this.toTimeSpan(value.closingTime),

      appointmentDurationMinutes:
        Number(value.appointmentDurationMinutes),

      bookingEnabled:
        Boolean(value.bookingEnabled),

      notificationEmail:
        value.notificationEmail?.trim() || undefined,

      appointmentNotificationsEnabled:
        Boolean(
          value.appointmentNotificationsEnabled
        ),

      messageNotificationsEnabled:
        Boolean(
          value.messageNotificationsEnabled
        )
    };

    this.settingsService
      .updateSettings(request)
      .subscribe({

        next: response => {

          this.isSaving.set(false);

          this.successMessage.set(
            response.message ||
            'Clinic settings saved successfully.'
          );

        },

        error: error => {

          console.error(
            'Unable to save clinic settings:',
            error
          );

          this.isSaving.set(false);

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to save clinic settings.'
          );
        }
      });
  }

  resetForm(): void {
    this.loadSettings();
  }

  get clinicName() {
    return this.settingsForm.controls.clinicName;
  }

  get email() {
    return this.settingsForm.controls.email;
  }

  get phone() {
    return this.settingsForm.controls.phone;
  }

  get address() {
    return this.settingsForm.controls.address;
  }

  private formatTime(value: string | null | undefined): string {

    if (!value) {
      return '';
    }

    return value.length >= 5
      ? value.substring(0, 5)
      : value;
  }

  private toTimeSpan(value: string | null | undefined): string {
    if (!value) {
      return '00:00:00';
    }

    return value.length === 5
      ? `${value}:00`
      : value;
  }
}