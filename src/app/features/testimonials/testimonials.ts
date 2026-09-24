import { Component } from '@angular/core';

interface Testimonial {
  initials: string;
  name: string;
  category: string;
  quote: string;
}

@Component({
  imports: [],
  selector: 'app-testimonials',
  styleUrl: './testimonials.scss',
  templateUrl: './testimonials.html',
})
export class Testimonials {

  testimonials: Testimonial[] = [
    {
      initials: 'NS',
      name: 'Naila S.',
      category: 'Women’s Healthcare',
      quote:
        'The best! Very friendly, polite, always ready to answer all my questions.'
    },
    {
      initials: 'PM',
      name: 'Palesa M.',
      category: 'Pregnancy Care',
      quote:
        'A very patient and friendly gynecologist,I felt comfortable and free to ask anything during consultation time about the pregnancy without fear of judgment.'
    },
    {
      initials: 'LK',
      name: 'Lebogang K.',
      category: 'General Consultation',
      quote:
        'The clinic is beautiful, clean and welcoming. Dr. Ofori takes time to explain everything and truly cares about her patients.'
    }
  ];
}
