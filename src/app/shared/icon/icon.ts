import { Component, input } from '@angular/core';

export type IconName =
  | 'heart'
  | 'baby'
  | 'calendar'
  | 'screening'
  | 'ultrasound'
  | 'fertility'
  | 'wellness'
  | 'shield'
  | 'spark'
  | 'arrow-right'
  | 'phone'
  | 'mail'
  | 'location'
  | 'check'
  | 'menu'
  | 'close'
  | 'instagram'
  | 'facebook'
  | 'whatsapp';

@Component({
  imports: [],
  selector: 'app-icon',
  standalone: true,
  styleUrl: './icon.scss',
  templateUrl: './icon.html',
})
export class Icon {
  name = input<IconName>('spark');

  size = input<number>(20);

  strokeWidth = input<number>(1.7);
}
