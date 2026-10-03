import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';


@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  templateUrl: './privacy-policy.html',
})
export class PrivacyPolicy implements OnInit {

  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeo(
      'Privacy Policy | Dr. Ofori Gyne Clinic',
      'Read the Privacy Policy for Dr. Ofori Gyne Clinic, including how personal information submitted through our website is collected, used and protected.',
      'https://www.gyneclinic.org.za/privacy-policy'
    );
  }
}