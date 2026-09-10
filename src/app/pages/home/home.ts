import { Component } from '@angular/core';
import { Icon, IconName } from '../../shared/icon/icon';
import { Appointment } from '../appointment/appointment';

interface Service {
  number: string;
  title: string;
  description: string;
  icon: IconName;
  accent: 'pink' | 'violet';
}

interface Benefit {
  title: string;
  description: string;
  icon: IconName;
}

interface JourneyStep {
  number: string;
  label: string;
  title: string;
  description: string;
}

interface Testimonial {
  initials: string;
  name: string;
  category: string;
  quote: string;
}

interface Resource {
  category: string;
  title: string;
  description: string;
  icon: IconName;
  featured?: boolean;
}

@Component({
  imports: [Icon, Appointment],
  selector: 'app-home',
  standalone: true,
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {

  services: Service[] = [
    {
      number: '01',
      title: 'Pregnancy Care',
      description:
        'Supportive care throughout your pregnancy journey, from early pregnancy through delivery.',
      icon: 'baby',
      accent: 'pink'
    },
    {
      number: '02',
      title: 'Family Planning',
      description:
        'Personalised contraceptive advice and reproductive health planning tailored to your needs.',
      icon: 'calendar',
      accent: 'violet'
    },
    {
      number: '03',
      title: 'Pap Smear',
      description:
        'Screening that helps detect cervical cell changes early and supports preventive care.',
      icon: 'screening',
      accent: 'pink'
    },
    {
      number: '04',
      title: 'Ultrasound',
      description:
        'Advanced imaging services supporting accurate assessment and diagnosis.',
      icon: 'ultrasound',
      accent: 'violet'
    },
    {
      number: '05',
      title: 'Fertility Care',
      description:
        'Compassionate reproductive health support for individuals and couples.',
      icon: 'fertility',
      accent: 'pink'
    },
    {
      number: '06',
      title: 'Menopause Care',
      description:
        'Support and treatment options for a healthier, more comfortable transition.',
      icon: 'wellness',
      accent: 'violet'
    }
  ];

  benefits: Benefit[] = [
    {
      title: 'Compassionate & Personalised Care',
      description:
        'Care that listens to your concerns and respects your individual needs.',
      icon: 'heart'
    },
    {
      title: 'Experienced Specialist',
      description:
        'Professional women’s healthcare delivered with experience and attention to detail.',
      icon: 'shield'
    },
    {
      title: 'Modern Facilities',
      description:
        'A comfortable environment supported by modern healthcare technology.',
      icon: 'spark'
    },
    {
      title: 'Confidential & Respectful',
      description:
        'Your privacy, dignity and comfort remain a priority throughout your care.',
      icon: 'check'
    }
  ];

  journeySteps: JourneyStep[] = [
    {
      number: '01',
      label: 'BOOK',
      title: 'Your Appointment',
      description:
        'Choose a convenient time and take the first step towards personalised care.'
    },
    {
      number: '02',
      label: 'CONSULT',
      title: 'Meet Dr. Ofori',
      description:
        'Discuss your concerns in a professional, confidential and welcoming environment.'
    },
    {
      number: '03',
      label: 'UNDERSTAND',
      title: 'Your Care Plan',
      description:
        'Receive clear information about your health and recommended next steps.'
    },
    {
      number: '04',
      label: 'CONTINUE',
      title: 'Ongoing Support',
      description:
        'Continue receiving guidance, treatment and support as your needs evolve.'
    }
  ];

  testimonials: Testimonial[] = [
    {
      initials: 'NM',
      name: 'Nomsa M.',
      category: 'Pregnancy Care',
      quote:
        'Dr. Ofori and her team made my pregnancy journey feel so smooth and stress-free. I felt safe, heard and cared for every step of the way.'
    },
    {
      initials: 'TS',
      name: 'Thandeka S.',
      category: 'Women’s Healthcare',
      quote:
        'Professional, kind and very thorough. The best gynaecologist I have ever visited. I trust her completely.'
    },
    {
      initials: 'LK',
      name: 'Lebogang K.',
      category: 'General Consultation',
      quote:
        'The clinic is beautiful, clean and welcoming. Dr. Ofori takes time to explain everything and truly cares about her patients.'
    }
  ];

  resources: Resource[] = [
    {
      category: 'Pregnancy',
      title:
        'Understanding Your Pregnancy: What to Expect From Your First Trimester',
      description:
        'A simple guide to the early stages of pregnancy and why starting antenatal care early matters.',
      icon: 'baby',
      featured: true
    },
    {
      category: 'Preventive Care',
      title: 'Why Regular Pap Smears Matter',
      description:
        'Understanding cervical screening and the importance of regular check-ups.',
      icon: 'screening'
    },
    {
      category: 'Women’s Health',
      title: 'Taking Care of Your Reproductive Health',
      description:
        'Simple steps every woman can take to stay informed about her reproductive health.',
      icon: 'heart'
    }
  ];

}
