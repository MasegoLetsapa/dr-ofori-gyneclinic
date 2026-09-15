import { Component, computed, inject, signal } from '@angular/core';
import { ServiceService } from '../../../core/services/service.service';
import { ClinicService, CreateServiceRequest, UpdateServiceRequest } from '../../../core/models/service.model';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  standalone: true,
  selector: 'app-services',
  styleUrl: './services.scss',
  templateUrl: './services.html',
})
export class Services {
  private readonly serviceService =
    inject(ServiceService);


  // ========================================
  // STATE
  // ========================================

  services =
    signal<ClinicService[]>([]);

  loading =
    signal(true);

  saving =
    signal(false);

  searchTerm =
    signal('');

  selectedStatus =
    signal('All');


  // ========================================
  // MODALS
  // ========================================

  showFormModal =
    signal(false);

  showViewModal =
    signal(false);

  showArchiveModal =
    signal(false);


  editingService =
    signal<ClinicService | null>(null);

  selectedService =
    signal<ClinicService | null>(null);

  serviceToArchive =
    signal<ClinicService | null>(null);


  // ========================================
  // FORM
  // ========================================

  formName = signal('');

  formDescription =
    signal('');

  formDuration =
    signal(30);

  formPrice =
    signal<number | null>(null);

  formIsActive =
    signal(true);


  // ========================================
  // MESSAGES
  // ========================================

  successMessage =
    signal('');

  errorMessage =
    signal('');


  // ========================================
  // COMPUTED
  // ========================================

  totalServices = computed(
    () => this.services().length
  );

  activeServices = computed(
    () =>
      this.services()
        .filter(service => service.isActive)
        .length
  );

  inactiveServices = computed(
    () =>
      this.services()
        .filter(service => !service.isActive)
        .length
  );


  filteredServices = computed(() => {

    const search =
      this.searchTerm()
        .trim()
        .toLowerCase();

    const status =
      this.selectedStatus();


    return this.services().filter(service => {

      const matchesSearch =
        !search ||
        service.name
          .toLowerCase()
          .includes(search) ||
        service.slug
          .toLowerCase()
          .includes(search) ||
        (service.description ?? '')
          .toLowerCase()
          .includes(search);


      const matchesStatus =
        status === 'All' ||
        (status === 'Active' && service.isActive) ||
        (status === 'Inactive' && !service.isActive);


      return matchesSearch && matchesStatus;

    });

  });


  // ========================================
  // INITIALIZE
  // ========================================

  ngOnInit(): void {
    this.loadServices();
  }


  // ========================================
  // LOAD
  // ========================================

  loadServices(): void {

    this.loading.set(true);

    this.serviceService
      .getAllServices()
      .subscribe({

        next: services => {

          this.services.set(services);

          this.loading.set(false);

        },

        error: error => {

          console.error(
            'Failed to load services:',
            error
          );

          this.errorMessage.set(
            'Unable to load services.'
          );

          this.loading.set(false);

        }

      });

  }


  // ========================================
  // ADD
  // ========================================

  openAddModal(): void {

    this.editingService.set(null);

    this.resetForm();

    this.showFormModal.set(true);

  }


  // ========================================
  // EDIT
  // ========================================

  openEditModal(service: ClinicService): void {

    this.editingService.set(service);

    this.formName.set(service.name);

    this.formDescription.set(
      service.description ?? ''
    );

    this.formDuration.set(
      service.durationMinutes
    );

    this.formPrice.set(
      service.price ?? null
    );

    this.formIsActive.set(
      service.isActive
    );

    this.showFormModal.set(true);

  }


  closeFormModal(): void {

    if (this.saving()) {
      return;
    }

    this.showFormModal.set(false);

    this.editingService.set(null);

  }


  resetForm(): void {

    this.formName.set('');

    this.formDescription.set('');

    this.formDuration.set(30);

    this.formPrice.set(null);

    this.formIsActive.set(true);

  }


  // ========================================
  // SAVE
  // ========================================

  saveService(): void {

    const name =
      this.formName().trim();

    if (!name) {

      this.errorMessage.set(
        'Service name is required.'
      );

      return;

    }


    if (this.formDuration() < 1) {

      this.errorMessage.set(
        'Duration must be at least 1 minute.'
      );

      return;

    }


    const price =
      this.formPrice();


    if (
      price !== null &&
      price < 0
    ) {

      this.errorMessage.set(
        'Price cannot be negative.'
      );

      return;

    }


    this.saving.set(true);

    this.errorMessage.set('');


    const editing =
      this.editingService();


    if (editing) {

      const request: UpdateServiceRequest = {

        name,

        description:
          this.formDescription().trim() ||
          null,

        durationMinutes:
          this.formDuration(),

        price,

        isActive:
          this.formIsActive()

      };


      this.serviceService
        .updateService(
          editing.id,
          request
        )
        .subscribe({

          next: updated => {

            this.services.update(
              services =>
                services.map(service =>
                  service.id === updated.id
                    ? updated
                    : service
                )
            );

            this.saving.set(false);

            this.showFormModal.set(false);

            this.editingService.set(null);

            this.successMessage.set(
              'Service updated successfully.'
            );

          },

          error: error => {

            console.error(
              'Failed to update service:',
              error
            );

            this.saving.set(false);

            this.errorMessage.set(
              error?.error?.message ??
              'Unable to update service.'
            );

          }

        });

      return;

    }


    const request: CreateServiceRequest = {

      name,

      description:
        this.formDescription().trim() ||
        null,

      durationMinutes:
        this.formDuration(),

      price

    };


    this.serviceService
      .createService(request)
      .subscribe({

        next: created => {

          this.services.update(
            services => [
              ...services,
              created
            ]
          );

          this.saving.set(false);

          this.showFormModal.set(false);

          this.successMessage.set(
            'Service created successfully.'
          );

        },

        error: error => {

          console.error(
            'Failed to create service:',
            error
          );

          this.saving.set(false);

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to create service.'
          );

        }

      });

  }


  // ========================================
  // VIEW
  // ========================================

  openViewModal(service: ClinicService): void {

    this.selectedService.set(service);

    this.showViewModal.set(true);

  }


  closeViewModal(): void {

    this.showViewModal.set(false);

    this.selectedService.set(null);

  }


  // ========================================
  // ARCHIVE
  // ========================================

  openArchiveModal(service: ClinicService): void {

    this.serviceToArchive.set(service);

    this.showArchiveModal.set(true);

  }


  closeArchiveModal(): void {

    this.showArchiveModal.set(false);

    this.serviceToArchive.set(null);

  }


  archiveService(): void {

    const service =
      this.serviceToArchive();

    if (!service) {
      return;
    }

    this.saving.set(true);

    this.serviceService
      .archiveService(service.id)
      .subscribe({

        next: () => {

          this.services.update(
            services =>
              services.map(item =>
                item.id === service.id
                  ? {
                    ...item,
                    isActive: false,
                    updatedAt:
                      new Date().toISOString()
                  }
                  : item
              )
          );

          this.saving.set(false);

          this.closeArchiveModal();

          this.successMessage.set(
            `${service.name} has been archived.`
          );

        },

        error: error => {

          console.error(
            'Failed to archive service:',
            error
          );

          this.saving.set(false);

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to archive service.'
          );

        }

      });

  }


  // ========================================
  // RESTORE
  // ========================================

  restoreService(service: ClinicService): void {

    this.saving.set(true);

    this.serviceService
      .restoreService(service.id)
      .subscribe({

        next: () => {

          this.services.update(
            services =>
              services.map(item =>
                item.id === service.id
                  ? {
                    ...item,
                    isActive: true,
                    updatedAt:
                      new Date().toISOString()
                  }
                  : item
              )
          );

          this.saving.set(false);

          this.successMessage.set(
            `${service.name} has been restored.`
          );

        },

        error: error => {

          console.error(
            'Failed to restore service:',
            error
          );

          this.saving.set(false);

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to restore service.'
          );

        }

      });

  }


  // ========================================
  // HELPERS
  // ========================================

  formatDuration(minutes: number): string {

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours =
      Math.floor(minutes / 60);

    const remaining =
      minutes % 60;

    if (remaining === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${remaining} min`;

  }


  formatPrice(
    price: number | null | undefined
  ): string {

    if (
      price === null ||
      price === undefined
    ) {
      return '—';
    }

    return `R ${price.toFixed(2)}`;

  }


  clearMessages(): void {

    this.successMessage.set('');

    this.errorMessage.set('');

  }
}
