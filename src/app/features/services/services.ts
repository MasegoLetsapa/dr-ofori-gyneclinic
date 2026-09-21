import { Component, inject, OnInit, signal } from '@angular/core';
import { Icon, IconName } from '../../shared/icon/icon';
import { ServiceService } from '../../core/services/service.service';
import { ClinicService } from '../../core/models/service.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [Icon],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class Services implements OnInit {

  private readonly serviceService =
    inject(ServiceService);

  services = signal<ClinicService[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.loadServices();
  }

  private loadServices(): void {
    this.loading.set(true);
    this.error.set('');

    this.serviceService.getServices().subscribe({
      next: services => {
        this.services.set(services);
        this.loading.set(false);
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
}