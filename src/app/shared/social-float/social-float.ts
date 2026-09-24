import { Component, signal } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-social-float',
  standalone: true,
  imports: [Icon],
  templateUrl: './social-float.html',
  styleUrl: './social-float.scss'
})
export class SocialFloat {
  readonly isOpen = signal(false);

  toggle(): void {
    this.isOpen.update(value => !value);
  }

  close(): void {
    this.isOpen.set(false);
  }
}