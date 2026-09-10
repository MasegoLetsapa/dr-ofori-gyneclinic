import { Component, signal } from '@angular/core';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  mobileMenuOpen = signal(false);

  toggleMenu(): void {
    this.mobileMenuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.mobileMenuOpen.set(false);
  }

}
