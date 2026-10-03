import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';
import { RouterLink } from '@angular/router';


@Component({
  imports: [RouterLink],
  selector: 'app-terms-and-conditions',
  standalone: true,
  templateUrl: './terms-and-conditions.html',
})
export class TermsAndConditions implements OnInit {

  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeo(
      'Terms & Conditions | Dr. Ofori Gyne Clinic',
      'Read the Terms & Conditions governing the use of the Dr. Ofori Gyne Clinic website, online appointment requests and website services.',
      'https://www.gyneclinic.org.za/terms-and-conditions'
    );
  }
}