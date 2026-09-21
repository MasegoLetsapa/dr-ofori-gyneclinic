import { Injectable, signal } from '@angular/core';
import { ClinicService } from '../models/service.model';

@Injectable({
    providedIn: 'root'
})
export class AppointmentModalService {

    readonly isOpen = signal(false);

    readonly selectedService =
        signal<ClinicService | null>(null);


    open(service?: ClinicService): void {

        if (service) {
            this.selectedService.set(service);
        }

        this.isOpen.set(true);

        document.body.style.overflow = 'hidden';
    }


    close(): void {

        this.isOpen.set(false);

        this.selectedService.set(null);

        document.body.style.overflow = '';
    }

}