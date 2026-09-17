import { Component, HostListener, inject, signal } from '@angular/core';
import { Icon } from "../../shared/icon/icon";
import { AppointmentModalService } from '../../core/services/appointment-modal.service';

@Component({
  imports: [Icon],
  standalone: true,
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  mobileMenuOpen = signal(false);

  private readonly appointmentModal = inject(AppointmentModalService);

  openAppointment(): void {
    this.closeMobileMenu();
    this.appointmentModal.open();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(open => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    // We'll use this later for the navbar scroll effect.
  }

}
