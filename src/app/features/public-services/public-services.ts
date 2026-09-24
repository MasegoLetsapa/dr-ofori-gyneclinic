import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  Icon,
  IconName
} from '../../shared/icon/icon';

import { ServiceService } from '../../core/services/service.service';
import { ClinicService } from '../../core/models/service.model';
import { AppointmentModalService } from '../../core/services/appointment-modal.service';
import { DecimalPipe } from '@angular/common';
import { Appointment } from '../../pages/appointment/appointment';
import { ActivatedRoute } from '@angular/router';
import { SocialFloat } from '../../shared/social-float/social-float';


@Component({
  selector: 'app-public-services',
  standalone: true,
  imports: [Icon, DecimalPipe, Appointment, SocialFloat],
  templateUrl: './public-services.html',
  styleUrl: './public-services.scss'
})
export class PublicServices implements OnInit {

  private readonly serviceService =
    inject(ServiceService);

  private readonly appointmentModal =
    inject(AppointmentModalService);

  private readonly route =
    inject(ActivatedRoute);

  private pendingServiceSlug: string | null = null;

  services = signal<ClinicService[]>([]);

  loading = signal(true);

  error = signal('');


  // Currently selected service
  selectedService =
    signal<ClinicService | null>(null);


  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {

      this.pendingServiceSlug =
        params.get('service');

      this.tryOpenPendingService();

    });

    this.loadServices();

  }

  private tryOpenPendingService(): void {

    if (!this.pendingServiceSlug) {
      return;
    }

    const service = this.services()
      .find(item =>
        item.slug === this.pendingServiceSlug
      );

    if (!service) {
      return;
    }

    this.openServiceDetails(service);

    this.pendingServiceSlug = null;
  }


  private loadServices(): void {

    this.loading.set(true);

    this.error.set('');

    this.serviceService.getServices().subscribe({

      next: services => {

        this.services.set(services);

        this.loading.set(false);

        this.tryOpenPendingService();

      },

      error: error => {

        console.error(
          'Failed to load services:',
          error
        );

        this.error.set(
          'Unable to load services right now.'
        );

        this.loading.set(false);

      }

    });
  }


  getServiceIcon(slug: string): IconName {

    const icons: Record<string, IconName> = {

      'pregnancy-care': 'baby',

      'family-planning': 'calendar',

      'pap-smear': 'screening',

      'ultrasound': 'ultrasound',

      'fertility-care': 'fertility',

      'menopause-care': 'wellness'

    };

    return icons[slug] ?? 'heart';
  }


  getServiceAccent(
    index: number
  ): 'pink' | 'violet' {

    return index % 2 === 0
      ? 'pink'
      : 'violet';

  }


  openServiceDetails(
    service: ClinicService
  ): void {

    this.selectedService.set(service);

    document.body.style.overflow = 'hidden';

  }


  closeServiceDetails(): void {

    this.selectedService.set(null);

    document.body.style.overflow = '';

  }


  bookAppointment(): void {

    const service =
      this.selectedService();

    this.closeServiceDetails();

    if (service) {
      this.appointmentModal.open(service);
      return;
    }

    this.appointmentModal.open();

  }

}