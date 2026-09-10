import { Component, HostListener, signal } from '@angular/core';
import { Icon } from "../../shared/icon/icon";

@Component({
  imports: [Icon],
  standalone: true,
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  mobileMenuOpen = signal(false);

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
